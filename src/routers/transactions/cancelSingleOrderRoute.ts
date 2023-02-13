import { Router } from "express";
import { cancelSingleOrder } from "../../controllers/bybit/cancelSingleOrder";

class cancelSingleOrderRouter {
  private _router = Router();
  private _controller = cancelSingleOrder;

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
    this._router.post("/", this._controller);
  }
}

export default new cancelSingleOrderRouter().router;
