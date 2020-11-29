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
const { forwardAuthenticated } = require("../config/auth");

// Login Page
router.get("/login", forwardAuthenticated, (req, res) =>
  res.render("pages/login")
);

// Register Page
router.get("/register", forwardAuthenticated, (req, res) =>
  res.render("pages/register")
);

// Register
router.post("/register", (req, res) => {
  const { name, email, password, password2 } = req.body;
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

// Create post
router.post("/create", multipartMiddleware, (req, res) => {
  cloudinary.uploader.upload(req.files.image.path, function (result) {
    // Create a post model
    // by assembling all data as object
    // and passing to Model instance
    var post = new Post({
      author: req.body.author,
      title: req.body.title,
      description: req.body.description,
      hashtag: req.body.hashtag,
      created_at: new Date(),
      // Store the URL in a DB for future use
      image: result.url,
      image_id: result.public_id,
    });
    // Persist by saving
    post.save(function (err) {
      if (err) {
        req.flash(err);
      }
      // Redirect
      res.redirect("/blog");
    });
  });
});

module.exports = router;
