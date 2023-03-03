import IUniswapV3PoolABI from "@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json";
import { computePoolAddress } from "@uniswap/v3-sdk";
import { ethers } from "ethers";

import { CurrentConfig } from "./config";
import { POOL_FACTORY_CONTRACT_ADDRESS } from "./constants";
import { getProvider } from "./providers";

interface PoolInfo {
  token0: string;
  token1: string;
  fee: number;
  tickSpacing: number;
  sqrtPriceX96: ethers.BigNumber;
  liquidity: ethers.BigNumber;
  tick: number;
}

export async function getPoolInfo(): Promise<PoolInfo> {
  const provider = getProvider();
  if (!provider) {
    throw new Error("No provider");
  }
  console.log(provider);

  const currentPoolAddress = computePoolAddress({
    factoryAddress: POOL_FACTORY_CONTRACT_ADDRESS,
    tokenA: CurrentConfig.tokens.in,
    tokenB: CurrentConfig.tokens.out,
    fee: CurrentConfig.tokens.poolFee,
  });

  const poolContract = new ethers.Contract(
    currentPoolAddress,
    IUniswapV3PoolABI.abi,
    provider
  );
  console.log("pool info??", await poolContract.functions.token0());
  const [token0, token1, fee, tickSpacing, liquidity, slot0] =
    await Promise.all([
      poolContract.functions.token0(),
      poolContract.functions.token1(),
      poolContract.functions.fee(),
      poolContract.functions.tickSpacing(),
      poolContract.functions.liquidity(),
      poolContract.slot0(),
    ]);

  return {
    token0,
    token1,
    fee,
    tickSpacing,
    liquidity,
    sqrtPriceX96: slot0[0],
    tick: slot0[1],
  };
}
