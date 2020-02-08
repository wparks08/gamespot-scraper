const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const articleSchema = new Schema({
    title: String,
    description: String,
    link: String,
    posted: Date,
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: "comment"
        }
    ]
});

const article = mongoose.model("article", articleSchema);

module.exports = article;
