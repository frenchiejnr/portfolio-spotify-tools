import express from "express";
import { expressLoader } from "./express";

export const loaders = async (app: express.Application) => {
  const expressApp = await expressLoader(app);
};
