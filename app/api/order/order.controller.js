const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
  getOrders: async (req, res) => {
    try {
      let orders;

      if (req.user.role === "user") {
        orders = await prisma.chat_rooms.findMany({
          where: {
            user_id: Number(req.user.id),
          },
          include: {
            psikolog: {
              select: {
                id: true,
                name: true,
                skill: true,
                psikolog_image: true,
              },
            },
            schedule: {
              select: {
                id: true,
                time: true,
              },
            },
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
              },
            },
          },
        });
      } else if (req.user.role === "psikolog") {
        const psikolog = await prisma.psikolog.findFirst({
          where: {
            user_id: Number(req.user.id),
          },
        });
        orders = await prisma.chat_rooms.findMany({
          where: {
            psikolog_id: Number(psikolog.id),
          },
          include: {
            psikolog: {
              select: {
                id: true,
                name: true,
                skill: true,
                psikolog_image: true,
              },
            },
            schedule: {
              select: {
                id: true,
                time: true,
              },
            },
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
              },
            },
          },
        });
      } else {
        orders = await prisma.chat_rooms.findMany({
          include: {
            psikolog: {
              select: {
                id: true,
                name: true,
                skill: true,
                psikolog_image: true,
              },
            },
            schedule: {
              select: {
                id: true,
                time: true,
              },
            },
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
              },
            },
          },
        });
      }

      return res.status(200).json({
        status: true,
        message: "SUCCESS_GET_ORDERS",
        data: orders,
      });
    } catch (error) {
      return res.status(500 || error.statusCode).json({
        status: false,
        message: error.message || "INTERNAL_SERVER_ERROR",
      });
    }
  },
  createOrder: async (req, res) => {
    try {
      const { psikolog_id, schedule_id, date } = req.body;

      const psikolog = await prisma.psikolog.findFirst({
        where: {
          id: Number(psikolog_id),
        },
      });
      if (!psikolog) {
        return res.status(404).json({
          status: false,
          message: "PSIKOLOG_NOT_FOUND",
        });
      }

      const schedule = await prisma.psikolog_schedules.findFirst({
        where: {
          AND: [
            {
              id: Number(schedule_id),
              psikolog_id: Number(psikolog_id),
              is_selected: true,
            },
          ],
        },
      });
      if (!schedule) {
        return res.status(404).json({
          status: false,
          message: "SCHEDULE_NOT_FOUND",
        });
      }

      const GET_TIME_NOW = new Date().getTime();
      const GET_TIME_SCHEDULE = new Date(date).setHours(
        schedule.time.split(":")[0],
        schedule.time.split(":")[1],
        0,
        0
      );

      if (GET_TIME_NOW > GET_TIME_SCHEDULE) {
        throw {
          statusCode: 400,
          message: "SCHEDULE_ALREADY_PASSED",
        };
      }

      const order = await prisma.chat_rooms.create({
        data: {
          psikolog_id: Number(psikolog_id),
          schedule_id: Number(schedule_id),
          user_id: req.user.id,
          consultation_day: new Date(date),
          is_closed: true,
        },
      });

      return res.status(201).json({
        status: true,
        message: "SUCCESS_CREATE_ORDER",
        data: order,
      });
    } catch (error) {
      return res.status(500 || error.statusCode).json({
        status: false,
        message: error.message || "INTERNAL_SERVER_ERROR",
      });
    }
  },
};
