import express, { Application, NextFunction, Request, Response } from "express";
import morgan from "morgan";
import cors from "cors";
import RootRouter from "./router";
import { io, SocketServer } from "./socket";
import { Server } from "http";
import { origin } from "../utils/miscellaneous/constants";
import CustomError from "../utils/lib/customEror";
import ErrorHandler from "../common/middleware/errorHandler/errorHandler";
import { db } from "./database";

class App {
  public app: Application;
  private port: number;
  private server: Server;
  private origin: string[] = origin;

  constructor(port: number) {
    this.app = express();
    this.port = port;
    this.server = SocketServer(this.app);
    this.initMiddleware();
    this.initRouters();

    this.notFoundRouter();
    this.errorHandle();
  }

  //start server
  public startServer() {
    this.server.listen(this.port, () => {
      console.log(`Shanta Property server has started at port: ${this.port}🚀`);
    });
  }

  //init middeleware
  private initMiddleware() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(morgan("dev"));
    this.app.use(cors({ origin: this.origin, credentials: true }));
  }

  // init routers
  private initRouters() {
    this.app.get("/", (_req: Request, res: Response) => {
      res.send(`Shanta Property server is running...🚀`);
    });
    this.app.use("/api/v1", new RootRouter().v1Router);
  }

  // not found router
  private notFoundRouter() {
    this.app.use("*", (_req: Request, _res: Response, next: NextFunction) => {
      next(new CustomError("Cannot found the route", 404));
    });
  }

  // error handler
  private errorHandle() {
    this.app.use(new ErrorHandler().handleErrors);
  }
}

export default App;
