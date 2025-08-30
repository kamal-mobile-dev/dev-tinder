const express = require('express');
const requestRouter = express.Router();
const ConnectionRequest = require('../models/connectionRequest');

const { adminAuth } = require('../middlewares/auth.js');
const { sendResponse } = require('../utils/helper.js');
const User = require('../models/user.js');

requestRouter.post('/request/send/:status/:toUserId', adminAuth, async (req, res) => {
  try {
    const { status, toUserId } = req.params;

    const connectionRequest = await ConnectionRequest({
      toUserId,
      status,
      fromUserId: req.user._id
    });

    if (toUserId == req.user._id) {
      return sendResponse(res, 500, 'failed', 'from and to user id can not same');
    }

    const allowedStatus = ['interested', 'ignored'];
    if (!allowedStatus.includes(status)) {
      return sendResponse(res, 500, 'failed', 'Incorrect request status');
    }

    const toUserIdExist = await User.findById(toUserId);

    if (!toUserIdExist) {
      return sendResponse(res, 500, 'failed', 'Incorrect to userid');
    }

    const connectionRequestExist = await ConnectionRequest.findOne({
      $or: [
        { toUserId: toUserId, fromUserId: req.user._id },
        { fromUserId: toUserId, toUserId: req.user._id }
      ],
      status: 'interested'
    });

    if (connectionRequestExist) {
      return sendResponse(res, 200, 'Success', 'Request already exists');
    }

    const data = await connectionRequest.save();
    return sendResponse(res, 200, 'Success', 'Connection requested sent successfully', data);
  } catch (error) {
    if (error.code == 11000) return sendResponse(res, 500, 'failed', 'Duplicate request');
    else return sendResponse(res, 500, 'failed', 'Internal server error ');
  }
});

requestRouter.post('/request/review/:status/:requestId', adminAuth, async (req, res) => {
  try {
    const { status, requestId } = req.params;

    const allowedStatus = ['accepted', 'rejected'];

    if (!allowedStatus.includes(status)) {
      return sendResponse(res, 500, 'failed', 'Incorrect request status');
    }

    const requestIdExist = await User.findById(requestId);

    if (!requestIdExist) {
      return sendResponse(res, 500, 'failed', 'Incorrect to request Id');
    }

    const connectionRequest = await ConnectionRequest.findOne({
      fromUserId: requestId,
      toUserId: req.user._id,
      status: 'interested'
    });

    if (!connectionRequest) {
      return sendResponse(res, 200, 'Failed', `Request not found`);
    }

    connectionRequest.status = status;

    await connectionRequest.save();

    return sendResponse(res, 200, 'Success', `Connection ${status} successfully`, data);
  } catch (error) {
    if (error.code == 11000) {
      return sendResponse(res, 500, 'failed', 'Duplicate request');
    } else {
      return sendResponse(res, 500, 'failed', 'Internal server error ' + error.message);
    }
  }
});

module.exports = requestRouter;
