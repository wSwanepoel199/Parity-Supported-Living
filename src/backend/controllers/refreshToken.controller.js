const refreshToken = require('../services/refreshToken.services');
const createError = require('http-errors');

class RefreshTokenController {
  static refreshToken = async (req, res, next) => {
    try {
      const refreshedUser = await refreshToken.refresh(req.cookies);
      res.status(200).json(refreshedUser);
    }
    catch (err) {
      next(createError(err.statusCode, err.message));
    }
  };

}

module.exports = RefreshTokenController;