var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var app = express();

const authRouter = require("./app/api/auth/auth.router");
const usersRouter = require("./app/api/users/users.router");
const newsRouter = require("./app/api/news/news.router");
const psikologsRouter = require("./app/api/psikologs/psikologs.router");

const URL_PREFIX_API_V1 = "/api/v1";

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/public", express.static(path.join(__dirname, "public")));

const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger_output.json");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

// Index Route
app.get("/", (req, res) => {
    return res.send("Behome Backend");
});

// API Routes
app.use(`${URL_PREFIX_API_V1}`, authRouter);
app.use(`${URL_PREFIX_API_V1}`, usersRouter);
app.use(`${URL_PREFIX_API_V1}`, newsRouter);
app.use(`${URL_PREFIX_API_V1}`, psikologsRouter);

app.use((req, res, next) => {
    return res.status(404).json({
        status: false,
        message: "PAGE_NOT_FOUND",
    });
});

module.exports = app;
