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

// Login Page
router.get("/login", forwardAuthenticated, (req, res) =>
  res.render("pages/login")
);

// Register Page
router.get("/register", forwardAuthenticated, (req, res) =>
  res.render("pages/register",{errors:null})
);

router.get("/info", ensureAuthenticated, (req, res)=>{
  Post.find({'author_id': req.query.id}, function (err, posts){
    res.render("pages/user_info",{user:req.user, posts:posts})
  })
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
  var contents=[]
  var savepath="articles/"+req.body.title
  var img1 = await cloudinary.uploader.upload(req.files.image1.path,{folder:savepath});
  var img2 = await cloudinary.uploader.upload(req.files.image2.path,{folder:savepath});
  var img3 = await cloudinary.uploader.upload(req.files.image3.path,{folder:savepath});
  urls.push(img1.url);
  urls.push(img2.url);
  urls.push(img3.url);
  img_id.push(img1.public_id);
  img_id.push(img2.public_id);
  img_id.push(img3.public_id);
  contents.push(req.body.content1);
  contents.push(req.body.content2);
  contents.push(req.body.content3);
  contents.push(req.body.content4);
  var article = new Article({
    author_id: req.body.author_id,
    author_name: req.body.author_name,
    title: req.body.title,
    sub_title: req.body.sub_title,
    hashtag: req.body.hashtag,
    created_at: new Date(),
    images: JSON.stringify(urls),
    images_id: JSON.stringify(img_id),
    content: JSON.stringify(contents),
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


//Update avatar
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

  res.redirect("/users/info?id="+req.user._id)
})

router.post("/test", multipartMiddleware, async (req,res)=>{
  var savepath = "articles/"+req.body.title;
  cloudinary.uploader.upload(req.files.image.path,{width:300, height:300, crop:"thumb",folder: savepath},(err,result)=>{
    res.render("pages/test");
  })
})

module.exports = router;
