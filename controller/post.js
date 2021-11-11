const mongoose = require("mongoose");

const Post = require("../model/post");
const Comment = require("../model/comment");

exports.postApost = (req, res, next) => {
  const post = new Post({
    _id: new mongoose.Types.ObjectId(),
    title: req.body.title,
    file: req.file.path,
    description: req.body.description,
    userId: req.userId,
  });
  post
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({ success: 1, message: process.env.POSTED });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ success: 0, message: process.env.POST_NOT_ADDED });
    });
};

exports.putPost = (req, res, next) => {
  Post.find(
    { _id: req.params.postId, userId: req.userId },
    function (err, result) {
      if (result.length > 0) {
        Post.updateOne(
          { _id: req.params.postId },
          {
            $set: {
              title: req.body.title,
              description: req.body.description,
            },
          }
        )
          .then((result) => {
            res
              .status(200)
              .json({ success: 1, message: process.env.POST_UPDATED });
          })
          .catch((err) => {
            console.log(err);
            res
              .status(500)
              .json({ success: 0, message: process.env.POST_NOT_UPDATED });
          });
      } else {
        res.status(500).json({ success: 0, message: process.env.UNAUTHORIZED });
      }
    }
  );
};

exports.getPost = (req, res, next) => {
  Post.findOne({ _id: req.params.postId })
    .populate("comments")
    .then((result) => {
      res.status(200).json({
        success: 1,
        message: process.env.POST_FETCHED,
        data: result,
      });
    })
    .catch((err) => {
      console.log(err);
      res
        .status(500)
        .json({ success: 0, message: process.env.POST_NOT_FETCHED });
    });
};


exports.deletePost = (req, res, next) => {
  Post.findById(
    { _id: req.params.postId, userId: req.userId },
    function (err, result) {
      if (result) {
        Comment.deleteMany({
          postId: result._id,
          comments: { $in: result.comments },
        });
        Post.deleteOne({ _id: req.params.postId })
          .then((result) => {
            res
              .status(200)
              .json({ success: 1, message: process.env.POST_DELETED });
          })
          .catch((err) => {
            res
              .status(500)
              .json({ success: 0, message: process.env.POST_NOT_DELETED });
          });
      } else {
        res.status(500).json({ success: 0, message: process.env.UNAUTHORIZED });
      }
    }
  );
};
