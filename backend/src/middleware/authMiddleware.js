const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const RealUser = require('../models/User');
const { MockUser } = require('../models/mockDb');

const getUserModel = () => {
  return global.isMockDB ? MockUser : RealUser;
};

const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      const userModel = getUserModel();
      if (global.isMockDB) {
        req.user = await userModel.findById(decoded.id);
      } else {
        req.user = await userModel.findById(decoded.id).select('-password');
      }
      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }
  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

module.exports = { protect };
