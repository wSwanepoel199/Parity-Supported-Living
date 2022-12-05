const prisma = require('../lib/prisma');
const createError = require('http-errors');
const jwt = require('../utils/jwt');

class RefreshTokenService {
  static async refresh(data) {
    if (!data?.jwt) throw createError.Unauthorized("No refresh token provided");
    const user = await prisma.user.findUnique({
      where: {
        refreshToken: data.jwt
      }
    });
    if (!user) throw createError.Unauthorized("No user with that provided token");
    user.accessToken = await jwt.verifyRefreshToken(data.jwt, user);
    delete user.refreshToken;
    return user;
  }
}

module.exports = RefreshTokenService;