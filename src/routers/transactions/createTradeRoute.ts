import { Router } from "express";
import { createTradeControl } from "../../controllers/uniswap/createTradeController";

class createTradeRouter {
  private _router = Router();
  private _controller = createTradeControl;

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

export default new createTradeRouter().router;
