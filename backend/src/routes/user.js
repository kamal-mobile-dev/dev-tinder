const express = require('express');
const { adminAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const { sendResponse } = require('../utils/helper.js');
const User = require('../models/user');
const { USER_SAFE_DATA } = require('../constants/index.js');

const userRouter = express.Router();

// get all the pending requests
userRouter.get('/user/requests/received', adminAuth, async (req, res) => {
  try {
    const request = await ConnectionRequest.find({
      toUserId: req.user._id,
      status: 'interested'
    }).populate('fromUserId', '-firstName');
    return sendResponse(res, 200, 'success', 'Data get successfully', request);
  } catch (error) {
    return sendResponse(res, 500, 'failed', 'Internal server error ');
  }
});

userRouter.get('/user/connections', adminAuth, async (req, res) => {
  try {
    let request = await ConnectionRequest.find({
      $or: [
        { fromUserId: req.user._id, status: 'accepted' },
        { toUserId: req.user._id, status: 'accepted' }
      ]
    })
      .populate('fromUserId', '-firstName')
      .populate('toUserId', '-firstName');

    request = request.map((row) => {
      if (row.fromUserId === req.user._id) {
        return row.toUserId;
      } else {
        return row.fromUserId;
      }
    });

    return sendResponse(res, 200, 'success', 'Data get successfully', request);
  } catch (error) {
    return sendResponse(res, 500, 'failed', 'Internal server error ' + error.message);
  }
});

userRouter.get('/feed', adminAuth, async (req, res) => {
  try {
    // user should see all the user card except
    // 0. his own card
    // 1. his connections
    // 2. ignored people
    // 3. already sent the connection request

    const loggedInUser = req.user;

    const page = parseInt(req.query.page) ?? 1;
    let limit = parseInt(req.query.limit) ?? 10;
    limit = limit > 50 ? 50 : limit;

    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }]
    }).select('fromUserId toUserId');

    const hideUsersFromFeed = new Set();

    connectionRequests.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });

    const users = await User.find({
      $and: [{ _id: { $nin: Array.from(hideUsersFromFeed) } }, { _id: { $ne: loggedInUser._id } }]
    })
      .select(USER_SAFE_DATA)
      .skip((page - 1) * limit)
      .limit(limit);

    return sendResponse(res, 200, 'success', 'Data get successfully', users);
  } catch (error) {
    return sendResponse(res, 500, 'failed', 'Internal server error ' + error.message);
  }
});

module.exports = userRouter;
