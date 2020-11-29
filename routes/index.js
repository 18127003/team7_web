const express = require("express");
// const { dirname } = require("path");
const router = express.Router();
// const path = require('path')
const { ensureAuthenticated, forwardAuthenticated, myAuth } = require("../config/auth");
const Article = require("../models/Article");
const Post = require("../models/Post");
const User = require("../models/User");

// Welcome Page
router.get("/", forwardAuthenticated, (req, res) => {
    Post.find({}, function (err, posts) {
        if(err) res.send(err);
        Article.countDocuments().exec(function(err, count){
            random = Math.floor(Math.random()*count)
            Article.find({}, function (err, articles){
                res.render('pages/home', {posts: posts,articles:articles, user: null,});
            }).select("images").skip(random)
        })
    }).sort({ _id: -1 }).limit(5);
    // res.render("pages/home", {layout:"layout.ejs",user:null})
});

// Map Page
router.get("/map", forwardAuthenticated, (req, res)=> res.render("pages/map_spring",{user:req.user}))

// Dashboard
router.get("/home", ensureAuthenticated, (req, res) =>{

    Post.find({}, function (err, posts) {
        if(err) res.send(err);
        Article.countDocuments().exec(function(err, count){
            random = Math.floor(Math.random()*count)
            Article.find({}, function (err, articles){
                res.render('pages/home', {posts: posts,articles:articles, user: req.user,});
            }).select("images").skip(random)
        })
    }).sort({ _id: -1 }).limit(5);
    // res.render("pages/home", {user: req.user,})
});

// Blog page
// router.get("/home/blog", myAuth, (req,res)=>res.render("pages/blog",{user: req.user}));

// router.get("/home/blog", myAuth, (req, res)=>{
//     Post.find({}, function (err, posts) {
//         if(err) res.send(err);

//         res.render('pages/blog', {posts: posts, user: req.user,});
//     });
// })

router.get("/blog*", myAuth, (req, res)=>{
    Post.find({}, function (err, posts) {
        if(err) res.send(err);

        res.render('pages/blog', {posts: posts, user: req.user,});
    });
})

// ABOUT US
router.get("/about", myAuth, (req, res)=>res.render("pages/about",{user: req.user,}))

// Search page
router.get("/search*",myAuth, (req, res)=>{
    Article.find({}, function (err, articles){
        if(err) res.send(err);
        res.render("pages/searchhome",{articles:articles, user:req.user})
    })
    
})

// Article page
router.get("/article*",myAuth, (req, res)=>{
    Article.findById(req.query._id,(err, article)=>{
        if(err) res.send(err);
        res.render("pages/article",{article:article, user:req.user})
    })
})
// router.get("/hello", forwardAuthenticated, (req,res)=>{
//   res.sendFile("hello.html",{root:path.join(__dirname,"../views")})
// })
// Create new post
router.get("/home/post", ensureAuthenticated, (req, res) =>res.render("pages/post",{user:req.user}));

module.exports = router;
