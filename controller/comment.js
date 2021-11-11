const mongoose = require("mongoose");
const Post = require("../model/post");
const Comment = require("../model/comment");

exports.like = (req, res, next) => {
  Post.findById(req.params.postId).then((result) => {
    if (result) {
      result.likes += 1;
      result
        .save()
        .then((result) => {
          res.status(200).json({
            success: 1,
            message: process.env.LIKED,
          });
          res.json(result);
        })
        .catch((err) => {
          res
            .status(500)
            .json({ success: 0, message: process.env.UNSUCCESSFULL });
        });
    }
  });
};

exports.comment = (req, res) => {
  const comment = new Comment({
    _id: new mongoose.Types.ObjectId(),
    postId: req.params.postId,
    postedById: req.userId,
    comment: req.body.comment,
  });
  return comment.save().then((result) => {
    Post.findById(req.params.postId)
      .then((post) => {
        post.comments.push(result._id);
        post.save().then((result) => {
          res.status(200).json({
            success: 1,
            message: process.env.COMMENTED,
            post: result,
          });
        });
      })
      .catch((err) => {
        console.log(err);
        res
          .status(500)
          .json({ success: 0, message: process.env.UNSUCCESSFULL });
      });
  });
};
