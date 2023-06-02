const swaggerAutogen = require("swagger-autogen")();
require("dotenv").config();

const outputFile = "./swagger_output.json";
const endpointsFiles = ["./app/api/**/*.router.js"];

const doc = {
  info: {
    version: "1.0.0",
    title: "Behome Backend",
  },
  host: `localhost:${process.env.APP_PORT || 3000}`,
  basePath: "/api/v1/",
  schemes: ["http"],
  securityDefinitions: {
    Bearer: {
      type: "apiKey",
      name: "Authorization",
    },
  },
};

swaggerAutogen(outputFile, endpointsFiles, doc);
