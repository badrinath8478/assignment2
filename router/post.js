const express = require("express");
const router = express.Router();
const postController = require("../controller/post");
const auth = require("../middleware/auth");
const multer = require("multer");
const path = require("path");


const storageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now().toString()+ path.extname(file.originalname));
  },
});

var upload = multer({ storage: storageEngine });

router.post("/post", auth, upload.single("file"), postController.postApost);

router.put("/put/:postId", auth, upload.single("file"), postController.putPost);

router.get("/get/:postId", auth, postController.getPost);

router.delete("/delete/:postId", auth, postController.deletePost);

module.exports = router;
