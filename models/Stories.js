var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new UserSchema object
// This is similar to a Sequelize model
var StoriesSchema = new Schema({
  headline: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  summary: {
      type: String,
      required: true
  },
  date: {
      type: String,
      required: false
  },
  Story: {
    type: Schema.Types.ObjectId,
    ref: "Story"
  }
});

// This creates our model from the above schema, using mongoose's model method
var Stories = mongoose.model("Stories", StoriesSchema);

// Export the Article model
module.exports = Stories;