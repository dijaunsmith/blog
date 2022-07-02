//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const homeStartingContent = "Welcome to OUR blog! This user-content-driven blog serves as a personal journal for the user/author, which can be me, or even you!";
const guideStartingContent ="To begin composing your first post, proceed to by adding '/compose' to the current website url. A preview of each post gets created below, prompting you to a page to read more. Happy blogging! "
const aboutContent = "The developer is a passionately driven individual, willing to learn and do whatever it takes for however long it takes, despite challenges, setbacks and roadblocks, to achieve his goals and objectives.";
const emailContactContent = "Email";
const githubContactContent = "Github";
const linkedInContactContent = "LinkedIn";
const portfolioLink = "Portfolio";


let posts = [];

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://<username>:<password>@cluster0.ack4obt.mongodb.net/blogDB");

const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);

app.get("/", function(req, res){  
  Post.find({},function(err, posts){
    res.render("home", {
      homeContent:homeStartingContent, 
      guideContent:guideStartingContent,
      posts:posts,
    });
  });
});

app.get("/about", function(req, res){
  res.render("about",{aboutParagraph:aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {
    contactParagraph:emailContactContent,
    github:githubContactContent,
    linkedIn:linkedInContactContent,
    portfolio:portfolioLink
  });
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/", function(req, res){
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });
  post.save(function(err){
    if (!err){
    res.redirect("/");
    }
    });
});



app.get("/posts/:postId", function(req, res){
  let requestedPostId = req.params.postId;
  
    Post.findOne({_id: requestedPostId}, function(err, post){
      res.render("post", {
        normalPostTopic: post.title,
        postContent: post.content
      });
    });
});



app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000");
});


// To restart the heroku app: heroku restart -a [app_name]
// In our case: heroku restart -a stark-earth-09003