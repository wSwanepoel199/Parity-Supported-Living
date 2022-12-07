const jwt = require('../utils/jwt');
const createError = require('http-errors');

const auth = async (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];
  console.log(token);
  if (!token) {
    return next(createError.Unauthorized('Token has not been provided'));
  }
  await jwt.verifyAccessToken(token).then(user => {
    req.user = user;
    next();
  }).catch(err => {
    res.status(err.statusCode).json({ status: err.statusCode, msg: err.message });
    next(createError.Unauthorized(err.message));
  });
};

module.exports = auth;