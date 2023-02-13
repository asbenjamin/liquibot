import { PerpPosition } from "bybit-api";

export type IPosition = PerpPosition & {
  user_id: number;
  symbol: string;
  side: string;
  size: number;
  position_value: number;
  realised_pnl: number;
  unrealised_pnl: number;
};
