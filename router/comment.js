const express = require("express");
const router = express.Router();
const CommentController = require("../controller/comment");
const auth = require("../middleware/auth");









router.post("/like/:postId", auth ,CommentController.like);

router.post("/comment/:postId",auth , CommentController.comment);




module.exports = router;



