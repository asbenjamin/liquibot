import { ethers, providers } from "ethers";
import { getAddress } from "ethers/lib/utils";
import { CurrentConfig } from "./uniswap/config";
import {
  ERC20_ABI,
  SWAP_ROUTER_ADDRESS,
  TOKEN_AMOUNT_TO_APPROVE_FOR_TRANSFER,
  WETH_TOKEN,
} from "./uniswap/constants";
import { getProvider, getWalletAddress } from "./uniswap/providers";
import { fromReadableAmount } from "./uniswap/utils";

export async function buyTokenUniswap() {
  const deadline = Math.floor(Date.now() / 1000) + 60 * 20;
  const provider = getProvider();
  const wallet = getWalletAddress();

  if (!wallet || !provider) {
    throw new Error("Cannot execute a trade without a connected wallet");
  }

  const router = new ethers.Contract(SWAP_ROUTER_ADDRESS, ERC20_ABI, provider);
  console.log(router);

  try {
    const tx = await router.swapExactETHForTokens(
      0,
      [CurrentConfig.tokens.in, CurrentConfig.tokens.out],
      wallet,
      deadline,
      {
        value: fromReadableAmount(
          TOKEN_AMOUNT_TO_APPROVE_FOR_TRANSFER,
          WETH_TOKEN.decimals
        ).toString(),
        gasLimit: 500000,
        gasPrice: ethers.utils.parseUnits("1000", "gwei"),
      }
    );
    console.log(tx);
    return tx;
  } catch (error) {
    console.log(error);
  }
}
