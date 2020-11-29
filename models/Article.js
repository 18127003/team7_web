var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// create a schema
var ArticleSchema = new Schema({
    title: String,
    sub_title: String,
    content: [String],
    images: [String],
    date: {
        type:Date,
        default: Date.now
    }
});
var Article = mongoose.model('Article', ArticleSchema);

module.exports = Article;