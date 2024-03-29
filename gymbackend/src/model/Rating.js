const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema({
    rating: {
        type: Number,
        required: true
    },
    excersizeId: {
        type: Number,
        required: true
    }
});

let Rating = mongoose.model("Rating", ratingSchema);
module.exports = Rating;