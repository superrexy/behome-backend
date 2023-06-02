const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const prisma = new PrismaClient();

module.exports = {
  profile: async (req, res) => {
    try {
      const { id } = req.user;

      const user = await prisma.users.findUnique({
        where: {
          id,
        },
      });

      delete user.password;

      return res.status(200).json({
        status: true,
        message: "USER_PROFILE",
        data: user,
      });
    } catch (error) {
      return res.status(500 || error.statusCode).json({
        status: false,
        message: error.message || "INTERNAL_SERVER_ERROR",
      });
    }
  },
  updateProfile: async (req, res, next) => {
    try {
      const { id } = req.user;
      const { name } = req.body;

      const checkUser = await prisma.users.findUnique({
        where: {
          id,
        },
      });

      if (req.file) {
        if (checkUser.user_image) {
          const path = checkUser.user_image;
          fs.unlinkSync(path);
        }

        await prisma.users.update({
          where: {
            id,
          },
          data: {
            user_image: req.file.path,
          },
        });
      }

      if (checkUser.role === "psikolog") {
        await prisma.psikolog.update({
          where: {
            user_id: id,
          },
          data: {
            name,
          },
        });
      }

      const user = await prisma.users.update({
        where: {
          id,
        },
        data: {
          name,
        },
      });

      delete user.password;

      return res.status(200).json({
        status: true,
        message: "USER_UPDATED",
        data: user,
      });
    } catch (error) {
      if (req.file) {
        const path = req.file.path;
        fs.unlinkSync(path);
      }

      return res.status(500 || error.statusCode).json({
        status: false,
        message: error.message || "INTERNAL_SERVER_ERROR",
      });
    }
  },
};
