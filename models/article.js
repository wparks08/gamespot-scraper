const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const articleSchema = new Schema({
    title: String,
    description: String,
    link: {
        type: String,
        unique: true
    },
    posted: Date,
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: "comment"
        }
    ],
    saved: {
        type: Boolean,
        default: false
    },
    image: String
});

const article = mongoose.model("article", articleSchema);

module.exports = article;
