const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwtHelpers = require("../helpers/jwt.helpers");

module.exports = async (req, res, next) => {
    try {
        const auth = req.headers.authorization;
        if (!auth) {
            throw {
                statusCode: 401,
                message: "UNAUTHORIZED",
            };
        }

        const token = auth.split(" ")[1];
        if (!token) {
            throw {
                statusCode: 401,
                message: "UNAUTHORIZED",
            };
        }

        const decoded = jwtHelpers.verifyToken(token);
        if (!decoded) {
            throw {
                statusCode: 401,
                message: "UNAUTHORIZED",
            };
        }

        const user = await prisma.users.findUnique({
            where: {
                id: decoded.id,
            },
        });

        req.user = user;
        next();
    } catch (error) {
        return res.status(500 || error.statusCode).json({
            status: false,
            message: error.message || "INTERNAL_SERVER_ERROR",
        });
    }
};
