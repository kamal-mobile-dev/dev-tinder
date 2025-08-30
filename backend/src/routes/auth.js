const express = require('express');
const User = require('../models/user.js');
const bcrypt = require('bcrypt');
const { sendResponse } = require('../utils/helper.js');

const authRouter = express.Router();

authRouter.post('/signup', async (req, res) => {
  try {
    const { firstName, lastName, emailId, password } = req.body;

    const hashPassword = await bcrypt.hash(password, parseInt(process.env.SALTS_ROUND));

    const user = new User({ firstName, lastName, emailId, password: hashPassword });

    await user.save();
    sendResponse(res, 201, 'success', 'User created successfully', user);
  } catch (err) {
    if (err.code === 11000) {
      return sendResponse(res, 400, 'failed', `Email '${req.body.emailId}' is already registered`);
    }
    sendResponse(res, 500, 'failed', 'Something went wrong', err.message);
  }
});

authRouter.post('/login', async (req, res) => {
  try {
    const { emailId, password } = req.body;

    if (!emailId || !password) {
      sendResponse(res, 500, 'failed', 'incorrect credentials');
    }

    const user = await User.findOne({ emailId });

    if (!user) {
      sendResponse(res, 404, 'failed', 'incorrect credentials ');
    }

    const isValidPassword = await user.isValidPassword(password);

    if (isValidPassword) {
      let token = await user.getJWT();
      res.cookie('token', token);
      sendResponse(res, 200, 'success', 'User login successfully', { userId: user.id });
    } else sendResponse(res, 404, 'failed', 'incorrect credentials');
  } catch (err) {
    sendResponse(res, 500, 'failed', 'Something went wrong', err.message);
  }
});

authRouter.post('/logout', async (req, res) => {
  try {
    // res.clearCookie('token');
    res.cookie('token', null, {
      expires: new Date(Date.now())
    });
    sendResponse(res, 200, 'success', 'User logout successfully');
  } catch (err) {
    sendResponse(res, 500, 'failed', 'Something went wrong', err.message);
  }
});

module.exports = authRouter;
