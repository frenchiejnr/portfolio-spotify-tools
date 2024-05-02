import express from "express";
const app = express();

const startServer = async () => {
  app.listen(4001, () => {
    console.log(`Server is listening on port 4001`);
  });
};

startServer();
