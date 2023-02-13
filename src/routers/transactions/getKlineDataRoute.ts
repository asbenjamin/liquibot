import { Router } from "express";
import { getKline } from "../../controllers/bybit/getKline";

class getKlineDataRouter {
  private _router = Router();
  private _controller = getKline;

  get router() {
    return this._router;
  }

  constructor() {
    this._configure();
  }

  /**
   * Connect routes to their matching controller endpoints.
   */
  private _configure() {
    this._router.get("/", this._controller);
  }
}

export default new getKlineDataRouter().router;
