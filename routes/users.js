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
      var result = await cloudinary.uploader.upload(img.path,{folder:"posts"}); 
      urls.push(result.url);
      img_id.push(result.public_id);
    })

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

module.exports = router;
