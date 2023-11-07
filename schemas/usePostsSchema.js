const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postsSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    likes: [],
    comments: [],
    time: {
        type: Number,
        required: true
    },
});
const posts = mongoose.model("posts", postsSchema);

module.exports = posts;