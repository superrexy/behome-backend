const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = (role) => {
  return async (req, res, next) => {
    try {
      if (!role) {
        throw {
          statusCode: 401,
          message: "UNAUTHORIZED",
        };
      }

      const { id } = req.user;
      const user = await prisma.users.findUnique({
        where: {
          id,
        },
      });

      if (!role.includes(user.role)) {
        throw {
          statusCode: 401,
          message: "UNAUTHORIZED",
        };
      }

      next();
    } catch (error) {
      return res.status(500 || error.statusCode).json({
        status: false,
        message: error.message || "INTERNAL_SERVER_ERROR",
      });
    }
  };
};
