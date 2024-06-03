const mongoose = require("mongoose");


const courseSchema = new mongoose.Schema({
    courseName: {
        type: String,
        required: true,
        trim: true,
    },
    courseDescription: {
        type: String,
        trim: true,
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    whatWillYouLearn: {
        type: String,
        trim: true,
    },
    courseContent: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Section",
        required: true
    }],
    ratingAndReviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "RatingAndReview",
    }],
    price: {
        type: String,
        required: true,
    },
    thumbnail: {
        type: String,
    },
    tags: {
        type: [String],
        required: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
    },
    studentEnrolled: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }]
}, {timestamps: true});

module.exports = mongoose.model("Course", courseSchema);