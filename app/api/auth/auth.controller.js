const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const jwtHelpers = require("../../helpers/jwt.helpers");
const prisma = new PrismaClient();

module.exports = {
  register: async (req, res) => {
    try {
      const { name, address, phone, email, password } = req.body;

      if (!name || !email || !password || !address || !phone) {
        throw {
          statusCode: 400,
          message: "BAD_REQUEST",
        };
      }

      const checkEmail = await prisma.users.findUnique({
        where: {
          email,
        },
      });

      if (checkEmail) {
        throw {
          statusCode: 400,
          message: "EMAIL_ALREADY_EXISTS",
        };
      }

      const genSalt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, genSalt);

      const user = await prisma.users.create({
        data: {
          name,
          email,
          password: hashPassword,
          role: "user",
          address,
          phone,
        },
      });

      delete user.password;

      //  Generate Access Token
      const token = jwtHelpers.generateToken(user);

      return res.status(201).json({
        status: true,
        message: "USER_REGISTERED",
        data: {
          user,
          token,
        },
      });
    } catch (error) {
      return res.status(500 || error.statusCode).json({
        status: false,
        message: error.message || "INTERNAL_SERVER_ERROR",
      });
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw {
          statusCode: 400,
          message: "BAD_REQUEST",
        };
      }

      const user = await prisma.users.findUnique({
        where: {
          email,
        },
      });
      if (!user) {
        throw {
          statusCode: 400,
          message: "EMAIL_NOT_FOUND",
        };
      }

      const checkPassword = await bcrypt.compare(password, user.password);
      if (!checkPassword) {
        throw {
          statusCode: 400,
          message: "INVALID_CREDENTIALS",
        };
      }

      delete user.password;

      //  Generate Access Token
      const token = jwtHelpers.generateToken(user);

      return res.status(200).json({
        status: true,
        message: "USER_LOGGED_IN",
        data: {
          user,
          token,
        },
      });
    } catch (error) {
      return res.status(500 || error.statusCode).json({
        status: false,
        message: error.message || "INTERNAL_SERVER_ERROR",
      });
    }
  },
};
