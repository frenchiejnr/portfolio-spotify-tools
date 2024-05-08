import express from "express";
import { loaders } from "./src/loaders";

const app = express();

const startServer = async () => {
  loaders(app);

  app.listen(4001, () => {
    console.log(`Server is listening on port 4001`);
  });
};

startServer();
