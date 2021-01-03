const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
var multipart = require("connect-multiparty");
var multipartMiddleware = multipart();
var cloudinary = require("../config/cloudinary");
// Load User model
const User = require("../models/User");
const Post = require("../models/Post");
const Article = require("../models/Article");
const { forwardAuthenticated, ensureAuthenticated } = require("../config/auth");
const Favorite = require("../models/Favorite");
const pusher = require("../config/pusher");
const Comment = require("../models/Comment");

// Login Page
router.get("/login", forwardAuthenticated, (req, res) =>
  res.render("pages/login")
);

// Register Page
router.get("/register", forwardAuthenticated, (req, res) =>
  res.render("pages/register",{errors:null})
);

// Information page
router.get("/info", ensureAuthenticated, async (req, res)=>{
  if(req.user._id==req.query.id){
    var posts = await Post.find({'author_id': req.user._id});
    if(req.user.role=="ADMIN"){
      var users = await User.find({role:{$ne: "ADMIN"}});
      var articles = await Article.find({"author_id":req.user._id});
      res.render("pages/user_info",{user:req.user, posts:posts, users:users, articles:articles, people:null})
    } else{
      res.render("pages/user_info",{user:req.user, posts:posts, people:null})
    }
  } else{
    var posts = await Post.find({'author_id': req.query.id});
    var people = await User.findById(req.query.id);
    res.render("pages/user_info",{user:req.user, posts:posts, people:people})
  }
  
})

// Add favorite
router.get("/addFavorite",ensureAuthenticated, async (req, res)=>{
  var fav = new Favorite({
    user_id:req.user._id,
    type: req.query.type,
    content_id: req.query.contentId
  })
  fav.save(function (err) {
    if (err) {
      req.flash(err);
    }
    res.send(" Success ");
  });
})

// Register
router.post("/register", (req, res) => {
  const { name, email, password, password2 } = req.body;
  var role="USER"
  let errors = [];

  if (!name || !email || !password || !password2) {
    errors.push({ msg: "Please enter all fields" });
  }

  if (password != password2) {
    errors.push({ msg: "Passwords do not match" });
  }

  if (password.length < 6) {
    errors.push({ msg: "Password must be at least 6 characters" });
  }

  if (errors.length > 0) {
    res.render("pages/register", {
      errors,
      name,
      email,
      password,
      password2,
    });
  } else {
    User.findOne({ email: email }).then((user) => {
      if (user) {
        errors.push({ msg: "Email already exists" });
        res.render("pages/register", {
          errors,
          name,
          email,
          password,
          password2,
        });
      } else {
        const newUser = new User({
          name,
          email,
          role,
          password,
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then((user) => {
                req.flash(user);
                res.redirect("/users/login");
              })
              .catch((err) => console.log(err));
          });
        });
      }
    });
  }
});

// Login
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/home",
    failureRedirect: "/users/login",
    failureFlash: true,
  })(req, res, next);
});

// Logout
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "You are logged out");
  res.redirect("/users/login");
});

// Delete post
router.get("/deletePost", async (req, res)=>{
  var post = await Post.findByIdAndDelete(req.query.id);
  images = JSON.parse(post.image_id);
  await post.remove();
  await asyncForEach(images, async(img)=>{
    await cloudinary.uploader.destroy(img);
  })
  res.setHeader("user",JSON.stringify(req.user))
  res.redirect("/users/info?id="+req.user._id)
})

// Delete article
router.get("/deleteArticle", async (req, res)=>{
  var article = await Article.findByIdAndDelete(req.query.id);
  images = JSON.parse(article.images_id);
  await article.remove();
  await asyncForEach(images, async(img)=>{
    await cloudinary.uploader.destroy(img);
  })
  res.setHeader("user",JSON.stringify(req.user))
  res.redirect("/users/info?id="+req.user._id)
})

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}
// Create post
router.post("/create", multipartMiddleware,async (req, res) => {
    var urls = []
    var img_id = []
    await asyncForEach(req.files.image, async (img)=>{
      let result = await cloudinary.uploader.upload(img.path,{folder:"posts"}); 
      urls.push(result.url);
      img_id.push(result.public_id);
    })
    if(urls.length==0){
      let result = await cloudinary.uploader.upload(req.files.image.path,{folder: "posts"});
      urls.push(result.url);
      img_id.push(result.public_id);
    }

    var post = new Post({
      author_id: req.body.author_id,
      author_name: req.body.author_name,
      title: req.body.title,
      description: req.body.description,
      hashtag: req.body.hashtag,
      created_at: new Date(),
      image: JSON.stringify(urls),
      image_id: JSON.stringify(img_id),
    });

    post.save(function (err) {
      if (err) {
        req.flash(err);
      }
      res.redirect("/blog");
    });
    post.on("es-indexed",(err,res)=>{
    })

});

// Create article
router.post("/write", multipartMiddleware,async (req, res) => {
  var urls=[]
  var img_id = []
  var savepath="articles/"+req.body.title
  req.files.image.forEach(img=>{
    if (img.originalFilename =='' && img.size == 0){
      req.files.image.splice(req.files.image.indexOf(img),1);
    }
  })
  req.body.content.forEach(cont=>{
    if (cont==''){
      req.body.content.splice(req.body.content.indexOf(cont),1);
    }
  })
  await asyncForEach(req.files.image, async img=>{
    let imgi = await cloudinary.uploader.upload(img.path,{folder:savepath});
    urls.push(imgi.url);
    img_id.push(imgi.public_id);
  })
  var article = new Article({
    author_id: req.body.author_id,
    author_name: req.body.author_name,
    title: req.body.title,
    sub_title: req.body.sub_title,
    hashtag: req.body.hashtag,
    created_at: new Date(),
    images: JSON.stringify(urls),
    images_id: JSON.stringify(img_id),
    content: JSON.stringify(req.body.content),
  });

  article.save(function (err) {
    if (err) {
      req.flash(err);
    }
    res.redirect("/home");
  });
  article.on("es-indexed",(err,res)=>{
  })

});


// Update avatar
router.post("/avatarUpdate", multipartMiddleware, async (req, res)=>{

  var user = await User.findById(req.user._id);
  if(user.avatar_id!=null){
    cloudinary.uploader.destroy(user.avatar_id, function(result){
      user.avatar=null;
      user.avatar_id=null;
    })
  }
  var img = await cloudinary.uploader.upload(req.files.avatar.path,{width:300, height:300, crop:"thumb", folder:"avatars"});
  user.avatar = img.url;
  user.avatar_id = img.public_id;
  await user.save()
  res.setHeader("user",JSON.stringify(req.user))
  res.redirect("/users/info?id="+req.user._id)

})

// Update post
router.post("/postUpdate",multipartMiddleware,async (req, res)=>{
  var post = await Post.findById(req.query.id);
  post.title = req.body.title;
  post.description = req.body.description; 
  // post.created_at = new Date.now;
  // console.log(req.body.title);
  // console.log(req.body.description);
  await post.save();
  res.setHeader("user",JSON.stringify(req.user))
  res.redirect("/users/info?id="+req.user._id)
})

// Update article
router.post("/articleUpdate", multipartMiddleware, async (req, res)=>{
  var article = await Article.findById(req.query.id);
  req.body.content.forEach(cont=>{
    if (cont==''){
      req.body.content.splice(req.body.content.indexOf(cont),1);
    }
  })
  article.sub_title = req.body.sub_title;
  article.content = JSON.stringify(req.body.content);
  article.hashtag = req.body.hashtag;

  await article.save();
  res.setHeader("user",JSON.stringify(req.user))
  res.redirect("/users/info?id="+req.user._id)
})

// Update user info
router.post("/updateUser", multipartMiddleware, async (req,res)=>{
  let user = await User.findById(req.query.id)
  user.name = req.body.name;
  user.email = req.body.email;
  user.bio = req.body.bio;
  await user.save();
  res.setHeader("user",JSON.stringify(req.user))
  res.redirect("/users/info?id="+req.user._id)
})

// Comment
router.post('/comment',multipartMiddleware, async (req, res)=>{

  var newComment = {
    name: req.body.new_comment_name,
    id: req.body.new_comment_id,
    comment: req.body.new_comment_text
  }
  pusher.trigger('flash-comments', 'new_comment', newComment);
  let comment = new Comment({
    author_id: req.body.new_comment_id,
    author_name: req.body.new_comment_name,
    content_id: req.body.content_id,
    content: req.body.new_comment_text,
    type:"Article",
    created_at: new Date()
  })
  await comment.save();
  res.json({ name:req.body.new_comment_name, id:req.body.new_comment_id, comment:req.body.new_comment_text });
  
});

router.post("/test", multipartMiddleware, async (req,res)=>{
  req.files.image.forEach(img=>{
    if (img.originalFilename =='' && img.size == 0){
      req.files.image.splice(req.files.image.indexOf(img),1);
    }
  })
  req.body.content.forEach(cont=>{
    if (cont==''){
      req.body.content.splice(req.body.content.indexOf(cont),1);
    }
  })
  res.render("pages/test");
})

module.exports = router;
