var express = require('express');
var mongoose = require('mongoose');
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = 3000;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/newsScraper", { useNewUrlParser: true });







//start express server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
});
  