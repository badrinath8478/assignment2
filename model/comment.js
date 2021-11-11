const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    postId : {  type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
    postedById : {  type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    comment : {type:String},
    postedOn : {type:Date, default:Date.now}
});

module.exports = mongoose.model('Comment', CommentSchema);