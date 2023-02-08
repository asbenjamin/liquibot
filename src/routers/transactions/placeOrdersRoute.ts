import { Router } from "express";
import { placeOrder } from "../../controllers/bybit/placeOrder"

class placeOrderRouter {
  private _router = Router();
  private _controller = placeOrder;

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

export default new placeOrderRouter().router;
