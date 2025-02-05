const jwt = require('jsonwebtoken');
const User = require('../models/users');
const mongoose = require('mongoose'); // لاستعمال ObjectId

const authenticate = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  // const token = req.cookies.token

  if (!token) {
    return res.status(401).json({ message: 'Access denied. ' });
  }

  try {
    // التحقق من التوكن
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: 'User not found.' });
    }


    req.user = {
      id: user._id,
      role: user.role,
    };

    next();
  } catch (error) {
    return res.status(400).json({ message: 'Invalid token.' });
  }
};

module.exports = authenticate;