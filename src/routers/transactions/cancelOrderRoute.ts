import { Router } from "express";
import { cancelOrders } from "../../controllers/bybit/cancelOrder";

class cancelOrdersRouter {
  private _router = Router();
  private _controller = cancelOrders;

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

export default new cancelOrdersRouter().router;
