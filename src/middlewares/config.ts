// app.use(express.json) - request handler, create a middleware that handles all requests
import express, { Express, urlencoded } from "express";
import expressRateLimit from "express-rate-limit";
import cors from "cors";

export function configureMiddleware(app: Express) {
  app.use(express.json());
  app.use(
    expressRateLimit({
      windowMs: 10 * 60 * 1000,
      max: 100,
    })
  );
  app.use(urlencoded({ extended: true }));
  app.use(cors());
}
