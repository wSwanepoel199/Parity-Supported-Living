const prisma = require('../lib/prisma');
const bcrypt = require('bcryptjs');
const createError = require('http-errors');
const jwt = require('../utils/jwt');

class AuthService {
  // register new user
  static async register(data) {
    const { email } = data;
    data.refreshToken = await jwt.signRefreshToken(email);
    data.password = bcrypt.hashSync(data.password, 8);
    const user = await prisma.user.create({
      data
    });
    data.accessToken = await jwt.signAccessToken(user.userId);
    delete data.refreshToken;
    return { data: data, token: user.refreshToken };
  }
  // logs in existing user
  static async login(data) {
    const { email, password } = data;
    console.log(data);
    const user = await prisma.user.findUnique({
      where: {
        email
      }
    });

    if (!user) throw createError.Unauthorized("Provided Email or Password is not correct");
    const checkPassword = bcrypt.compareSync(password, user.password);
    if (!checkPassword) throw createError.Unauthorized("Provided Email or Password is not correct");
    delete user.password;
    const accessToken = await jwt.signAccessToken(user.userId);
    return { ...user, accessToken };
  }
  static async all() {
    const allUsers = await prisma.user.findMany();
    return allUsers;
  }
}

module.exports = AuthService;