import { Configs } from "../config";
import { BybitService } from "../exchange";

export const bybitService = new BybitService({
  key: Configs.key,
  secret: Configs.secret,
  baseUrl: Configs.baseUrl,
  testnet: true,
});
