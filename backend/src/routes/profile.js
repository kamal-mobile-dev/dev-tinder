const express = require('express');
const { sendResponse } = require('../utils/helper.js');
const { adminAuth } = require('../middlewares/auth.js');
const User = require('../models/user.js');
const { validateEditProfileData } = require('../utils/validation.js');
var validator = require('validator');
const bcrypt = require('bcrypt');

const profileRouter = express.Router();

profileRouter.get('/profile', adminAuth, async (req, res) => {
  try {
    sendResponse(res, 200, 'success', 'Users fetched successfully', req.user);
  } catch (error) {
    sendResponse(res, 500, 'failed', 'Internal server error');
  }
});

profileRouter.patch('/profile', adminAuth, async (req, res) => {
  try {
    const { photoUrl, skills, age, gender } = req.body;

    validateEditProfileData(req, res);

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { photoUrl, skills, age, gender },
      { new: true }
    );
    if (user) {
      sendResponse(res, 200, 'success', 'User updated successfully', user);
    } else {
      sendResponse(res, 500, 'success', 'Failed to update user');
    }
  } catch (error) {
    sendResponse(res, 500, 'failed', 'Internal server error');
  }
});

profileRouter.patch('/profile/password', adminAuth, async (req, res) => {
  try {
    const password = req.body.password;
    if (!password || !validator.isStrongPassword(password)) {
      sendResponse(res, 500, 'failed', 'Please supply strong password');
    }

    const hashPassword = await bcrypt.hash(password, parseInt(process.env.SALTS_ROUND));

    console.log({ password, hashPassword, id: req.user._id });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { password: hashPassword },
      { new: true }
    );

    console.log({ password, hashPassword, id: req.user._id, user });

    if (!user) {
      sendResponse(res, 500, 'failed', 'Failed to updated password');
    } else {
      sendResponse(res, 200, 'success', 'Password updated successfully', user);
    }
  } catch (error) {
    sendResponse(res, 500, 'failed', 'Internal server error ' + error.message);
  }
});

module.exports = profileRouter;
