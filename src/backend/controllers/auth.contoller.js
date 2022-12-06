const auth = require('../services/auth.services');
const createError = require('http-errors');

class AuthController {
  static register = async (req, res, next) => {
    try {
      const user = await auth.register(req.body);
      console.log(user);
      res.cookie('jwt', user.token, {
        httpOnly: true,
        // secure: true, 
        // SameSite: "None", 
        maxAge: (24 * 60 * 60 * 1000 * 200)
      });
      res.status(201).json({
        status: 201,
        msg: "User Created",
        data: user.data
      });
    }
    catch (err) {
      next(createError(err.statusCode, err.message));
    }
  };
  static login = async (req, res) => {
    try {
      console.log(req.body);
      const data = await auth.login(req.body);
      res.cookie('jwt', data.refreshToken, {
        httpOnly: true,
        // SameSite: "None", 
        // secure: true, 
        maxAge: (24 * 60 * 60 * 1000 * 200)
      });
      delete data.refreshToken;
      res.status(200).json({
        status: 200,
        msg: "Logged In Successfully",
        data
      });
    }
    catch (err) {
      // next(createError(err.statusCode, err.message));
      console.log(err.statusCode);
      res.status(err.statusCode).json({
        status: err.statusCode,
        msg: err.message
      });
    }
  };
  static all = async (req, res, next) => {
    try {
      const users = await auth.all();
      res.status(200).json({
        status: 200,
        msg: "All Users Found",
        data: users
      });
    }
    catch (err) {
      next(createError(err.statusCode, err.message));
    }
  };
}

module.exports = AuthController;