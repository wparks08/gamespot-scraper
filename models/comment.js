const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    text: String
});

const comment = mongoose.model("comment", commentSchema);

module.exports = comment;
