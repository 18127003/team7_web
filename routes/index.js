const express = require("express");
// const { dirname } = require("path");
const router = express.Router();
// const path = require('path')
var mongoose = require("mongoose");
const {
  ensureAuthenticated,
  forwardAuthenticated,
  myAuth,
} = require("../config/auth");
const Article = require("../models/Article");
const Comment = require("../models/Comment");
const Favorite = require("../models/Favorite");
const Post = require("../models/Post");

// Welcome Page
router.get("/", forwardAuthenticated, async (req, res) => {
  var posts = await Post.find({}).sort({ _id: -1 }).limit(5).exec();
  Article.countDocuments().exec(function (err, count) {
    random = Math.floor(Math.random() * count);
    Article.find({}, function (err, articles) {
      res.render("pages/home", {
        posts: posts,
        articles: articles,
        user: null,
      });
    })
      .select("images")
      .skip(random);
  });
  // res.render("pages/home", {layout:"layout.ejs",user:null})
});

// Map Page
router.get("/map", myAuth, async (req, res) =>{
  articles=[];
  season = req.query.season;
  result = await Article.search(
    { query_string: { query: season } },
    { hydrate: true }
  )
  await asyncForEach(result.hits.hits, async(res)=>{
    if(res.hashtag.includes(req.query.season)){
      await articles.push(res)
    }
  })
  
  switch(req.query.season){
    case "xuan":
      res.render("pages/map_spring", { user: req.user, articles:articles });
      break;
    case "ha":
      res.render("pages/map_summer", { user: req.user, articles:articles });
      break;
    case "thu":
      res.render("pages/map_autumn", { user: req.user, articles:articles });
      break;
    case "dong":
      res.render("pages/map_winter", { user: req.user, articles:articles });
      break;
    default:
      res.end();
      break;
  }
  
});

// Dashboard
router.get("/home", ensureAuthenticated, async (req, res) => {
  var posts = await Post.find({}).sort({ _id: -1 }).limit(5).exec();
  Article.countDocuments().exec(function (err, count) {
    random = Math.floor(Math.random() * count);
    Article.find({}, function (err, articles) {
      res.render("pages/home", {
        posts: posts,
        articles: articles,
        user: req.user,
      });
    })
      .select("images")
      .skip(random);
  });
  // res.render("pages/home", {user: req.user,})
});

// Blog page

router.get("/blog", myAuth, async (req, res) => {
  // res.render("pages/preload");
  var posts = await Post.find({});

  let fav_content = []
  if(req.user!=null){
    var favorites = await Favorite.find({user_id:req.user._id})
  
    favorites.forEach(fav=>{
      fav_content.push(fav.content_id)
    })
  }
  posts.forEach(p=>{
    if(fav_content.includes(p._id.toString())==true){
      p.like = true
    } else{
      p.like = false
    }
  })
  res.render("pages/blog", { posts: posts, user: req.user });
  
});

// ABOUT US
router.get("/about", myAuth, (req, res) =>
  res.render("pages/about", { user: req.user })
);

// Search page

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}
router.get("/search", myAuth, async (req, res) => {
  var posts =[]
  var articles = []
  if(req.query.search_key!=null){
    var result = await Post.search(
      { query_string: { query: req.query.search_key } },
      { hydrate: true }
    )
    await asyncForEach(result.hits.hits, async(res)=>{
      await posts.push(res)
    })
    result = await Article.search(
      { query_string: { query: req.query.search_key } },
      { hydrate: true }
    )
    await asyncForEach(result.hits.hits, async(res)=>{
      await articles.push(res)
    })
    res.render("pages/searchhome",{user:req.user,posts:posts, articles:articles, key:req.query.search_key})
  }
  else{
    articles = await Article.find({});
    res.render("pages/searchhome",{user:req.user,posts:posts, articles:articles, key:""})
  }
  
});

// Article page
router.get("/article", myAuth, async (req, res) => {
  let article = await Article.findById(req.query._id)
  let comment = await Comment.find({"content_id":req.query._id,"type":"Article"})
  res.render("pages/article", { article: article,comment:comment, user: req.user });
});

// Create new post
router.get("/home/post", ensureAuthenticated, (req, res) =>
  res.render("pages/post", { user: req.user })
);

// Create new article
router.get("/home/new_article",ensureAuthenticated, (req, res)=>{
  if(req.user.role=="ADMIN"){
    res.render("pages/new_article",{user:req.user})
  } else{
    res.redirect("/home");
  }
})

// Update article
router.get("/home/update_article",ensureAuthenticated,async (req, res)=>{
  let article = await Article.findById(req.query.id);
  res.render("pages/article_update",{user:req.user, article:article})
  // res.redirect("/home");
})
router.get("/test",myAuth,(req,res)=>{
  res.render("flutter/index");
})
module.exports = router;
