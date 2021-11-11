require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");




const userRouter = require("./router/user");
const postRouter = require("./router/post");
const commentRouter = require("./router/comment");



mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(process.env.DB_CONNECTED);
  })
  .catch((err) => {
    console.log(err);
  });
mongoose.Promise = global.Promise;




app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/public/file",express.static(path.join(__dirname, "public/file")));

app.use("/user", userRouter);
app.use("/user", postRouter);
app.use("/user", commentRouter);




app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});


app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});


module.exports = app;