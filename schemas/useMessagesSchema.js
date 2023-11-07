const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messagesSchema = new Schema({
    fromUsername: {
        type: String,
        required: true
    },
    toUsername: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    time: {
        type: Number,
        required: true
    },
});
const messages = mongoose.model("messages", messagesSchema);

module.exports = messages;