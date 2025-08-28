var jwt = require('jsonwebtoken');
const JWT_SECRET = 'DDQk3uZcqisBQ5xU@#$WwmKySaCls9rTYfQ7%$#';
const User = require('../models/user');

const adminAuth = async (req, res, next) => {
  try {
    const openPaths = ['/login', '/signup'];

    if (openPaths.includes(req.path)) {
      return next();
    }

    const cookie = req.cookies;
    const { token } = cookie;

    var decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      res.status(500).send('Unauthoriozed access');
    } else {
      req.user = user;
      next();
    }
  } catch (error) {
    res.status(500).send('Unauthoriozed access');
  }
};

module.exports = { adminAuth };
