const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
  sendMessage: async (req, res) => {
    try {
      const { message, chat_id } = req.body;

      let chat;
      let data;

      if (req.user.role === "psikolog") {
        const psikolog = await prisma.psikolog.findFirst({
          where: {
            user_id: Number(req.user.id),
          },
        });

        chat = await prisma.chat_rooms.findFirst({
          where: {
            id: Number(chat_id),
            psikolog_id: Number(psikolog.id),
          },
          include: {
            user: {},
            psikolog: {},
          },
        });
        if (!chat) {
          return res.status(404).json({
            status: false,
            message: "CHAT_NOT_FOUND",
          });
        }

        await prisma.chat_messages.create({
          data: {
            chat_id: Number(chat_id),
            user_id: Number(req.user.id),
            message: message,
          },
        });

        data = await prisma.chat_messages.create({
          data: {
            chat_id: Number(chat_id),
            user_id: Number(req.user.id),
            message: message,
          },
        });

        if (req.user.role === "user") {
          req.io.to(`chats-${chat.psikolog.user_id}`).emit("chats", "NEW");
        } else {
          req.io.to(`chats-${chat.user_id}`).emit("chats", "NEW");
        }

        req.io.to(`chat-${chat_id}`).emit("chat", {
          ...data,
          from: req.user.role,
        });

        return res.status(201).json({
          status: true,
          message: "SUCCESS_SEND_MESSAGE",
          data: data,
        });
      } else {
        chat = await prisma.chat_rooms.findFirst({
          where: {
            id: Number(chat_id),
            user_id: Number(req.user.id),
          },
          include: {
            user: {},
            psikolog: {},
          },
        });
        if (!chat) {
          return res.status(404).json({
            status: false,
            message: "CHAT_NOT_FOUND",
          });
        }

        data = await prisma.chat_messages.create({
          data: {
            chat_id: Number(chat_id),
            user_id: Number(req.user.id),
            message: message,
          },
        });

        if (req.user.role === "user") {
          req.io.to(`chats-${chat.psikolog.user_id}`).emit("chats", "NEW");
        } else {
          req.io.to(`chats-${chat.user_id}`).emit("chats", "NEW");
        }

        req.io.to(`chat-${chat_id}`).emit("chat", {
          ...data,
          from: req.user.role,
        });

        return res.status(201).json({
          status: true,
          message: "SUCCESS_SEND_MESSAGE",
          data: {
            ...data,
            from: req.user.role,
          },
        });
      }
    } catch (error) {
      return res.status(500 || error.statusCode).json({
        status: false,
        message: error.message || "INTERNAL_SERVER_ERROR",
      });
    }
  },
  getChat: async (req, res) => {
    try {
      const { chat_id } = req.params;

      let chat;

      if (req.user.role === "psikolog") {
        const psikolog = await prisma.psikolog.findFirst({
          where: {
            user_id: Number(req.user.id),
          },
        });

        chat = await prisma.chat_rooms.findFirst({
          where: {
            id: Number(chat_id),
            psikolog_id: psikolog.id,
          },
          include: {
            psikolog: {},
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        });
        if (!chat) {
          return res.status(404).json({
            status: false,
            message: "CHAT_NOT_FOUND",
          });
        }

        const chatMessages = await prisma.chat_messages.findMany({
          where: {
            chat_id: Number(chat_id),
          },
          include: {
            user: {},
          },
          orderBy: {
            created_at: "asc",
          },
        });

        return res.status(200).json({
          status: true,
          message: "SUCCESS_GET_CHAT",
          data: {
            psikolog: chat.psikolog,
            user: chat.user,
            chats: chatMessages.map((message) => {
              return {
                ...message,
                from: message.user.role,
              };
            }),
          },
        });
      } else if (req.user.role === "user") {
        chat = await prisma.chat_rooms.findFirst({
          where: {
            id: Number(chat_id),
            user_id: Number(req.user.id),
          },
          include: {
            psikolog: {},
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        });

        if (!chat) {
          return res.status(404).json({
            status: false,
            message: "CHAT_NOT_FOUND",
          });
        }

        const chatMessages = await prisma.chat_messages.findMany({
          where: {
            chat_id: Number(chat_id),
          },
          include: {
            user: {},
          },
          orderBy: {
            created_at: "asc",
          },
        });

        return res.status(200).json({
          status: true,
          message: "SUCCESS_GET_CHAT",
          data: {
            psikolog: chat.psikolog,
            user: chat.user,
            chats: chatMessages.map((message) => {
              return {
                ...message,
                from: message.user.role,
              };
            }),
          },
        });
      } else {
        chat = await prisma.chat_rooms.findFirst({
          where: {
            id: Number(chat_id),
          },
          include: {
            psikolog: {},
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        });
        if (!chat) {
          return res.status(404).json({
            status: false,
            message: "CHAT_NOT_FOUND",
          });
        }

        const chatMessages = await prisma.chat_messages.findMany({
          where: {
            chat_id: Number(chat_id),
          },
          include: {
            user: {},
          },
          orderBy: {
            created_at: "asc",
          },
        });

        return res.status(200).json({
          status: true,
          message: "SUCCESS_GET_CHAT",
          data: {
            psikolog: chat.psikolog,
            user: chat.user,
            chats: chatMessages.map((message) => {
              return {
                ...message,
                from: message.user.role,
              };
            }),
          },
        });
      }
    } catch (error) {
      return res.status(500 || error.statusCode).json({
        status: false,
        message: error.message || "INTERNAL_SERVER_ERROR",
      });
    }
  },
};
