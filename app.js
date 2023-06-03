const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const { createServer } = require("http");
const { Server } = require("socket.io");
const schedule = require("node-schedule");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  socket.on("chats", async (data) => {
    socket.join(`chats-${data.user_id}`);
  });

  socket.on("chat", async (data) => {
    socket.join(`chat-${data.chat_id}`);
  });
});

schedule.scheduleJob("*/1 * * * *", async () => {
  const chats = await prisma.chat_rooms.findMany({
    where: {
      is_closed: true,
      is_finished: true,
    },
    include: {
      schedule: {},
    },
  });

  chats.forEach(async (chat) => {
    // close chat if message 1 hour closed time
    const now = new Date();
    const expired = new Date(chat.consultation_day).setHours(
      chat.schedule.time.split(":")[0],
      chat.schedule.time.split(":")[1],
      0,
      0
    );
    const diff = now.getTime() - expired;
    const diffHours = Math.floor(diff / 1000 / 60 / 60);

    if (diffHours >= 1) {
      await prisma.chat_rooms.update({
        where: {
          id: chat.id,
        },
        data: {
          is_closed: true,
        },
      });

      io.to(`chats-${chat.user_id}`).emit("chat-closed", true);
      io.to(`chat-${chat.id}`).emit("chat-closed", true);
    }
  });
});

const authRouter = require("./app/api/auth/auth.router");
const orderRouter = require("./app/api/order/order.router");
const usersRouter = require("./app/api/users/users.router");
const newsRouter = require("./app/api/news/news.router");
const psikologsRouter = require("./app/api/psikologs/psikologs.router");
const chatsRouter = require("./app/api/chats/chats.router");

const URL_PREFIX_API_V1 = "/api/v1";

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/public", express.static(path.join(__dirname, "public")));
app.use((req, res, next) => {
  req.io = io;
  return next();
});

const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger_output.json");
app.use(
  `${URL_PREFIX_API_V1}/docs`,
  swaggerUi.serve,
  swaggerUi.setup(swaggerFile)
);

app.get(`${URL_PREFIX_API_V1}/docs-json`, (req, res) => {
  return res.status(200).send(swaggerFile);
});

// Index Route
app.get("/", (req, res) => {
  return res.send("Behome Backend");
});

// API Routes
app.use(`${URL_PREFIX_API_V1}`, authRouter);
app.use(`${URL_PREFIX_API_V1}`, usersRouter);
app.use(`${URL_PREFIX_API_V1}`, newsRouter);
app.use(`${URL_PREFIX_API_V1}`, psikologsRouter);
app.use(`${URL_PREFIX_API_V1}`, orderRouter);
app.use(`${URL_PREFIX_API_V1}`, chatsRouter);

app.use((req, res, next) => {
  return res.status(404).json({
    status: false,
    message: "PAGE_NOT_FOUND",
  });
});

server.listen(process.env.APP_PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.APP_PORT || 3000}`);
});

module.exports = app;
