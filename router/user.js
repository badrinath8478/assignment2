const express = require("express");
const router = express.Router();
const Controller = require("../controller/user");









router.post("/register",Controller.userRegister);

router.post("/login", Controller.login);

router.post("/verify/:userId", Controller.verifyOtp);

router.post("/forgotPassword", Controller.forgotPassword);

router.put("/resetPassword/:userId", Controller.resetPassword);



module.exports = router;



