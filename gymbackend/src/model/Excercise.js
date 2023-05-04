const mongoose = require("mongoose");

const excerciseSchema = new mongoose.Schema({
    Category: {
        type: String,
        required: true
      },
      Difficulty: {
        type: String,
        required: true
      },
      Force: {
        type: String,
        required: false
      },
      Grips: {
        type: String,
        required: false
      },
      details: {
        type: String,
        required: false
      },
      exercise_name: {
        type: String,
        required: true
      },
      steps: {
        type: [String],
        required: true
      },
      target: {
        Primary: {
          type: [String],
          required: true
        },
        Secondary: {
          type: [String],
          required: true
        }
      },
      videoURL: {
        type: [String],
        required: true
      },
      youtubeURL: {
        type: String,
        required: false
      }
});

let Exersise = mongoose.model("Excercise", excerciseSchema);
module.exports = Exersise;