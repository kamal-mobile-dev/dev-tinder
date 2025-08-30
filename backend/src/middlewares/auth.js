var jwt = require('jsonwebtoken');
const User = require('../models/user');
const { sendResponse } = require('../utils/helper.js');

const adminAuth = async (req, res, next) => {
  try {
    const cookie = req.cookies;
    const { token } = cookie;

    if (!token) {
      sendResponse(res, 500, 'failed', 'Unauthoriozed access', null);
    }

    var decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded._id);

    if (!user) {
      sendResponse(res, 500, 'failed', 'Unauthoriozed access', null);
    } else {
      req.user = user;
      next();
    }
  } catch (error) {
    sendResponse(res, 500, 'failed', 'Unauthoriozed access', null);
  }
};

module.exports = { adminAuth };
