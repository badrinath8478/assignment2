const mongoose = require('mongoose');


const PostSchema = new mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    userId : {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    title : {type: String, required: true},
    file : {type: String, required: true},
    likes : {type: Number, default: 0},
    description : {type: String},
    comments : [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}],
    PostedOn : {type: Date, default: Date.now}
    
});

module.exports = mongoose.model('Post', PostSchema);