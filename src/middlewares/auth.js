const adminAuth = (req, res, next) => {
  console.log('adminAuth ');
  next();
};

module.exports = { adminAuth };
