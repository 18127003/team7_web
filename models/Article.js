var mongoose = require("mongoose");
const mongoosastic = require('mongoosastic');
const esClient = require("../config/elastic");
var Schema = mongoose.Schema;

// create a schema
var ArticleSchema = new Schema({
    author_id: String,
    author_name: {type: String, ex_indexed: true},
    title: {type: String, ex_indexed: true},
    sub_title: {type: String, ex_indexed: true},
    content: {type: String, ex_indexed: true},
    hashtag: {type:String, ex_indexed: true},
    images: String,
    images_id: String,
    created_at: {
        type:Date,
        default: Date.now
    }
});
ArticleSchema.plugin(mongoosastic,{esClient:esClient})
var Article = mongoose.model('Article', ArticleSchema);
Article.createMapping((err, mapping) => {
});
module.exports = Article;