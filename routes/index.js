const express = require("express");
// const { dirname } = require("path");
const router = express.Router();
// const path = require('path')
const {
  ensureAuthenticated,
  forwardAuthenticated,
  myAuth,
} = require("../config/auth");
const Article = require("../models/Article");
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
router.get("/map", myAuth, (req, res) =>
  res.render("pages/map_spring", { user: req.user })
);

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

router.get("/blog", myAuth, (req, res) => {
  Post.find({}, function (err, posts) {
    if (err) res.send(err);

    res.render("pages/blog", { posts: posts, user: req.user });
  });
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
  }
  else{
    articles = await Article.find({});
  }
  res.render("pages/searchhome",{user:req.user,posts:posts, articles:articles})
});

// Article page
router.get("/article", myAuth, (req, res) => {
  Article.findById(req.query._id, (err, article) => {
    if (err) res.send(err);
    res.render("pages/article", { article: article, user: req.user });
  });
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
router.get("/test",myAuth,(req,res)=>{
  res.render("pages/test");
})
module.exports = router;
