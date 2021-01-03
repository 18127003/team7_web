var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// create a schema
var commentSchema = new Schema({
    author_name: {type: String, required: true},
    author_id: {type: String, required: true},
    content_id: {type: String, required: true},
    content: {type:String, required: true},
    type: {type: String, required:true},
    created_at: {
        type:Date,
        default: Date.now
    }
});

var Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;