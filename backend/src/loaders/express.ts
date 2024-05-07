import express from "express";
import cors from "cors";

export const expressLoader = (app: express.Application) => {
  app.use(express.json());
  app.use(cors({}));
};
