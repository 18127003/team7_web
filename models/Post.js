var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// create a schema
var postSchema = new Schema({
    author: String,
    title: String,
    description: String,
    image: String,
    image_id: String,
    hashtag: String,
    created_at: {
        type:Date,
        default: Date.now
    }
});
var Post = mongoose.model('Post', postSchema);

module.exports = Post;