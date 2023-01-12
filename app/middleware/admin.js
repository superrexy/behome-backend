const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = async (req, res, next) => {
  try {
    const { id } = req.user;
    const user = await prisma.users.findUnique({
      where: {
        id,
      },
    });

    if (user.role !== "psikolog") {
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
