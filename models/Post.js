var mongoose = require("mongoose");
const mongoosastic = require('mongoosastic');
const esClient = require("../config/elastic");
const Promise = require("bluebird");
var Schema = mongoose.Schema;

// create a schema
var postSchema = new Schema({
    author_id: String,
    author_name:{type:String, ex_indexed: true},
    title: {type:String, ex_indexed: true},
    description: {type:String, ex_indexed: true},
    image: String,
    image_id: String,
    hashtag: {type:String, ex_indexed: true},
    created_at: {
        type:Date,
        default: Date.now
    }
});
postSchema.plugin(mongoosastic,{
    esClient: esClient
})
var Post = mongoose.model('Post', postSchema);
Post.createMapping((err, mapping) => {
});
Post.search = Promise.promisify(Post.search,{context: Post})
module.exports = Post;