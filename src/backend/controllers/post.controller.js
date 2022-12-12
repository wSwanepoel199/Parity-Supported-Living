const post = require('../services/post.services');
const createError = require('http-errors');


class PostController {
  static create = async (req, res, next) => {

  };
  static all = async (req, res, next) => {
    try {
      const posts = await post.all();

      res.status(200).json({
        status: 200,
        msg: "All Posts Found",
        data: posts
      });
    }
    catch (err) {
      res.status(err.statusCode).json({ status: err.statusCode, msg: err.message });
      next(createError(err.statusCode, err.message));
    }
  };
}

module.exports = PostController;