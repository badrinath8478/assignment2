const mongoose = require("mongoose");
const User = require("../model/user");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const randomize = require("randomatic");
const jwt = require("jsonwebtoken");

var transporter = nodemailer.createTransport({
  service: process.env.SERVICE,
  auth: {
    user: process.env.MY_MAIL,
    pass: process.env.MY_PASSWORD,
  },
});


exports.userRegister = (req, res, next) => {
  const { userName, email, password } = req.body;
  const otp = randomize("0", 6);
  User.findOne({ email: email })
    .exec()
    .then((user) => {
      if (user) {
        res.status(500).json({ success: 0, error: process.env.MAIL_EXISTS });
      } else {
        bcrypt.hash(password, 10, (err, hash) => {
          const user = new User({
            _id: new mongoose.Types.ObjectId(),
            userName: userName,
            email: email,
            password: hash,
            OTP: otp,
            otpExpire: Date.now() + 3600,
          });
          return user.save().then((result) => {
            let mailOptions = {
              from: process.env.MY_MAIL,
              to: email,
              subject: process.env.LOGIN,
              text: `Hello, to login into your account here is the OTP  "${otp}". \n This otp expires in 10 minutes.`,
            };
            transporter.sendMail(mailOptions, (err) => {
              if (err) {
                res.status(500).json({ success: 0, error: err });
              }
            });
            res.status(201).json({
              success: 1,
              message: process.env.REGISTERED_SUCCESSFULLY,
              userId: result._id,
            });
          });
        });
      }
    })
    .catch((err) => {
      res.status(500).json({ success: 0, error: err });
    });
};

exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email: email })
    .exec()
    .then((user) => {
      if (!user) {
        res
          .status(500)
          .json({ success: 0, error: process.env.EMAIL_NOT_REGISTERED });
      } else if (user.isVerified === true) {
        bcrypt.compare(password, user.password, (err, result) => {
           if (result) {
            const token = jwt.sign(
              {
                email: user.email,
                userId: user._id,
              },
              process.env.JWT_SECRET,
              {
                expiresIn: "15d",
              }
            );
            res
              .status(201)
              .json({ success: 1, message: process.env.SUCCESS, token: token });
          } else {
            res
              .status(500)
              .json({ success: 0, error: process.env.INCORRECT_PASSWORD });
          }
        });
      } else {
        res.status(500).json({ success: 0, error: process.env.GET_VERIFIED });
      }
    })
    .catch((err) => {
      res.status(500).json({ success: 0, error: err });
    });
};

exports.verifyOtp = (req, res, next) => {
  compareOtp = req.body.otp;
  User.findByIdAndUpdate({
    _id: req.params.userId,
    otpExpire: { $gt: Date.now() },
  })
    .then((user) => {
      if (user.OTP === compareOtp) {
        user.OTP = null;
        user.otpExpire = null;
        user.isVerified = true;
        user.save();
        res.status(200).json({ success: 1, message: process.env.OTP_VERIFIED });
      } else {
        res
          .status(500)
          .json({ success: 0, error: process.env.OTP_INCORRECT_EXPIRED });
      }
    })
    .catch((err) => {
      res.status(500).json({ success: 0, error: err });
    });
};

exports.forgotPassword = (req, res, next) => {
  const { email } = req.body;
  User.findOne({ email: email })
    .exec()
    .then((user) => {
      const otp = randomize("0", 6);
      user.OTP = otp;
      user.otpExpire = Date.now() + 3600;
      user.isVerified = false;
      return user.save();
    })
    .then((user) => {
      let mailOptions = {
        from: process.env.MY_MAIL,
        to: email,
        subject: process.env.FORGOT_OTP,
        text: `${process.env.RESET_PASSWORD} "${user.OTP}"`,
      };
      transporter.sendMail(mailOptions, (err) => {
        if (err) {
          res.status(500).json({ success: 0, error: err });
        }
      });
      res.status(200).json({
        success: 1,
        message: process.env.MAIL_SENT,
        userId: user._id,
      });
    })
    .catch((err) => {
      res.status(500).json({ success: 0, error: err });
    });
};

exports.resetPassword = (req, res, next) => {
  const { password, confirm } = req.body;
  User.findOne({ _id: req.params.userId })
    .then((user) => {
      if (user.isVerified === true) {
        bcrypt.hash(password, 10, (err, hash) => {
          if (password === confirm) {
            user.password = hash;
            user.OTP = null;
            user.otpExpires = null;
            user.save();
            res
              .status(200)
              .json({ success: 1, message: process.env.PASSWORD_RESET });
          }
        });
      } else {
        res.status(500).json({
          success: 0,
          error: process.env.GET_VERIFIED_TO_RESETPASSWORD,
        });
      }
    })
    .catch((err) => {
      return res.status(500).json({ success: 0, error: err });
    });
};
