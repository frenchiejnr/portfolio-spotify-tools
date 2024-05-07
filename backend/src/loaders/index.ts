import express from "express";
import { expressLoader } from "./express";

module.exports = async (app: express.Application) => {
  const expressApp = await expressLoader(app);
};
