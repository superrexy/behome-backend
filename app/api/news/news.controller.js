const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const prisma = new PrismaClient();

module.exports = {
  getNews: async (req, res) => {
    try {
      const news = await prisma.news.findMany({});

      return res.status(200).json({
        status: true,
        message: "SUCCESS_GET_NEWS",
        data: news,
      });
    } catch (error) {
      return res.status(500 || error.statusCode).json({
        status: false,
        message: error.message || "INTERNAL_SERVER_ERROR",
      });
    }
  },
  getNewsByID: async (req, res) => {
    try {
      const { id } = req.params;
      const news = await prisma.news.findUnique({
        where: {
          id: Number(id),
        },
      });

      if (!news) {
        throw {
          statusCode: "404",
          message: "NEWS_NOT_FOUND",
        };
      }

      return res.status(200).json({
        status: true,
        message: "SUCCESS_GET_NEWS",
        data: news,
      });
    } catch (error) {
      return res.status(500 || error.statusCode).json({
        status: false,
        message: error.message || "INTERNAL_SERVER_ERROR",
      });
    }
  },
  createNews: async (req, res) => {
    try {
      const { description } = req.body;

      if (!req.file || !description) {
        throw {
          statusCode: 400,
          message: "BAD_REQUEST",
        };
      }

      const news = await prisma.news.create({
        data: {
          description,
          news_image: req.file.path,
          user_id: req.user.id,
        },
      });

      return res.status(201).json({
        status: true,
        message: "SUCCESS_CREATE_NEWS",
        data: news,
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
  updateNews: async (req, res) => {
    try {
      const { description } = req.body;
      const { id } = req.params;
      const news = await prisma.news.findUnique({
        where: {
          id: Number(id),
        },
      });

      if (!news) {
        throw {
          statusCode: "404",
          message: "NEWS_NOT_FOUND",
        };
      }

      if (!description) {
        throw {
          statusCode: 400,
          message: "BAD_REQUEST",
        };
      }

      if (req.file) {
        const path = news.news_image;
        fs.unlinkSync(path);

        await prisma.news.update({
          where: {
            id: news.id,
          },
          data: {
            description,
            news_image: req.file.path,
          },
        });
      }

      const updateNews = await prisma.news.update({
        where: {
          id: news.id,
        },
        data: {
          description,
        },
      });

      return res.status(200).json({
        status: true,
        message: "SUCCESS_UPDATE_NEWS",
        data: updateNews,
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
  deleteNews: async (req, res) => {
    try {
      const { id } = req.params;
      const news = await prisma.news.findUnique({
        where: {
          id: Number(id),
        },
      });

      if (!news) {
        throw {
          statusCode: "404",
          message: "NEWS_NOT_FOUND",
        };
      }

      const path = news.news_image;
      fs.unlinkSync(path);

      await prisma.news.delete({
        where: {
          id: news.id,
        },
      });

      return res.status(200).json({
        status: true,
        message: "SUCCESS_DELETE_NEWS",
      });
    } catch (error) {
      return res.status(500 || error.statusCode).json({
        status: false,
        message: error.message || "INTERNAL_SERVER_ERROR",
      });
    }
  },
};
