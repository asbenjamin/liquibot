import { configureMiddleware } from "./middlewares/config";
import dotenv from "dotenv";
import express, { Request, Response, NextFunction } from "express";
import MasterRouter from "./routers/MasterRouter";

import ErrorHandler from "./models/ErrorHandler";
import { bot } from "./utils/telegraf/botInit";
import { Configs } from "./config";

/**
 * Express server application class.
 * @description Will later contain the routing system.
 */
class Server {
  public app = express();
  public router = MasterRouter;
}

// initialize server app
const server = new Server();
configureMiddleware(server.app);

// make server listen on some port
((port = Configs.application_port || 5000) => {
  server.app.listen(port, () => console.log(`> Listening on port ${port}`));
})();

server.app.use("/api", server.router);

bot.launch()

// make server app handle any error
server.app.use(
  (err: ErrorHandler, req: Request, res: Response, next: NextFunction) => {
    res.status(err.statusCode || 500).json({
      status: "error",
      statusCode: err.statusCode,
      message: err.message,
    });
  }
);
