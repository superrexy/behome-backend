const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const prisma = new PrismaClient();

module.exports = {
  getPsikologs: async (req, res) => {
    try {
      if (req.user.role === "psikolog") {
        const psikolog = await prisma.psikolog.findMany({
          include: { psikolog_schedules: {} },
          where: { user_id: req.user.id },
        });

        return res.status(200).json({
          status: true,
          message: "SUCCESS_GET_PSIKOLOG",
          data: psikolog,
        });
      }

      const psikolog = await prisma.psikolog.findMany({
        include: { psikolog_schedules: {} },
      });

      return res.status(200).json({
        status: true,
        message: "SUCCESS_GET_PSIKOLOG",
        data: psikolog,
      });
    } catch (error) {
      return res.status(500 || error.statusCode).json({
        status: false,
        message: error.message || "INTERNAL_SERVER_ERROR",
      });
    }
  },
  getPsikologByID: async (req, res) => {
    try {
      const { id } = req.params;
      const psikolog = await prisma.psikolog.findFirst({
        include: { psikolog_schedules: {} },
        where: {
          id: Number(id),
        },
      });

      if (!psikolog) {
        return res.status(404).json({
          status: false,
          message: "PSIKOLOG_NOT_FOUND",
        });
      }

      return res.status(200).json({
        status: true,
        message: "SUCCESS_GET_PSIKOLOG",
        data: psikolog,
      });
    } catch (error) {
      return res.status(500 || error.statusCode).json({
        status: false,
        message: error.message || "INTERNAL_SERVER_ERROR",
      });
    }
  },
  updatePsikolog: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, skill, virtual_account_payment, schedules } = req.body;
      const psikolog = await prisma.psikolog.findFirst({
        where: { id: Number(id) },
      });

      if (!psikolog) {
        return res.status(404).json({
          status: false,
          message: "PSIKOLOG_NOT_FOUND",
        });
      }

      const data = await prisma.$transaction(
        async (tx) => {
          if (req.file) {
            if (psikolog.psikolog_image) {
              const path = psikolog.psikolog_image;
              fs.unlinkSync(path);
            }

            await tx.psikolog.update({
              where: {
                id: psikolog.id,
              },
              data: {
                name,
                skill,
                virtual_account_payment,
                psikolog_image: req.file.path,
              },
            });
          }

          await tx.psikolog.update({
            where: {
              id: psikolog.id,
            },
            data: {
              name,
              skill,
              virtual_account_payment,
              user: {
                update: {
                  name,
                },
              },
            },
          });

          if (schedules) {
            const jsonSchedules = JSON.parse(schedules);
            await Promise.all(
              jsonSchedules.map(async (schedule) => {
                await tx.psikolog_schedules.update({
                  where: {
                    id: schedule.id,
                  },
                  data: {
                    is_selected: schedule.is_selected,
                  },
                });
              })
            );
          }

          return await tx.psikolog.findUnique({
            where: {
              id: psikolog.id,
            },
            include: {
              psikolog_schedules: {},
            },
          });
        },
        { timeout: 10000 }
      );

      return res.status(200).json({
        status: true,
        message: "SUCCESS_UPDATE_PSIKOLOG",
        data: data,
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
