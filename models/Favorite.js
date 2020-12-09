var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// create a schema
var favSchema = new Schema({
    user_id: {type: String, required: true},
    type: {type: String, required: true},
    content_id: {type:String, required: true},
    created_at: {
        type:Date,
        default: Date.now
    }
});

var Favorite = mongoose.model('Favorite', favSchema);

module.exports = Favorite;