var express = require('express');
var mongoose = require('mongoose');
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = process.env.Port || 3000;

// Initialize Express
var app = express();

// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
//mongoose.connect("mongodb://localhost/newsScraper", { useNewUrlParser: true });
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://PierreTest:P$123456@ds253368.mlab.com:53368/heroku_3jzsd02j";

mongodb://<dbuser>:<dbpassword>@ds253368.mlab.com:53368/heroku_3jzsd02j

mongoose.connect(MONGODB_URI);

// Routes
app.get("/scrape", function(req, res) {
    
    //delete all documents if exist
    db.Stories.remove({}).then(function(){
    axios.get("https://www.npr.org/sections/food/").then(function(response) {
        // Then, we load that into cheerio and save it to $ for a shorthand selector
        var $ = cheerio.load(response.data);
    
        // Now, we grab every h2 within an article tag, and do the following:
        $("div .item-info").each(function(i, element) {
        // Save an empty result object
        var result = {};
    
        result.headline = $(this).children('h2').text();
        result.summary = $(this).children('p').text();
        result.url = $('.item-info > p > a', this).attr('href');
        result.date = $('.item-info > p > a > time', this).text();

        // Create a new Story in Stories using the `result` object built from scraping
        db.Stories.create(result)
          .then(function(dbArticle) {
            // View the added result in the console
            console.log(dbArticle);
          }).catch(function(err) {
            // If an error occurred, log it
            console.log(err);
          });
      });
      
      res.send("Scrape Complete");
    });
  });
});  
// Route for getting all Articles from the db
  app.get("/stories", function(req, res) {
    // Grab every document in the Articles collection
    db.Stories.find({})
      .then(function(dbArticle) {
        // If we were able to successfully find Articles, send them back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });
  
  // Route for grabbing a specific Article by id, populate it with it's note
  app.get("/stories/:id", function(req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.Stories.findOne({ _id: req.params.id })
      // ..and populate all of the notes associated with it
      .populate("Comment")
      .then(function(dbArticle) {
        // If we were able to successfully find an Article with the given id, send it back to the client
        console.log(dbArticle)
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });
  
  // Route for saving/updating an Article's associated Note
  app.post("/stories/:id", function(req, res) {
    // Create a new note and pass the req.body to the entry
    db.Comment.create(req.body)
      .then(function(dbNote) {
        // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
        // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
        // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
        return db.Stories.findOneAndUpdate({ _id: req.params.id }, { comment: dbNote._id }, { new: true });
      })
      .then(function(dbArticle) {
        // If we were able to successfully update an Article, send it back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });

//start express server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
});
  