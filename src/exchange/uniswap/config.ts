import { Token } from "@uniswap/sdk-core";
import { FeeAmount } from "@uniswap/v3-sdk";
import { Configs } from "../../config";
import { USDC_TOKEN, WETH_TOKEN } from "./constants";

export interface ExampleConfig {
  rpc: {
    local: string;
    mainnet: string;
  };
  wallet: {
    address: string;
    privateKey: string;
  };
  tokens: {
    in: Token;
    amountIn: number;
    out: Token;
    poolFee: number;
  };
}

export const CurrentConfig: ExampleConfig = {
  rpc: {
    local: "http://localhost:8545",
    mainnet: `https://goerli.infura.io/v3/${Configs.infura_api_key}`,
  },
  wallet: {
    address: Configs.wallet_address,
    privateKey: Configs.wallet_private_key,
  },
  tokens: {
    in: WETH_TOKEN,
    amountIn: 0.1,
    out: USDC_TOKEN,
    poolFee: FeeAmount.MEDIUM,
  },
};
