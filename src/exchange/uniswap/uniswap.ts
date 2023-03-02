import { Percent, Token, TradeType } from "@uniswap/sdk-core";
import { SwapOptions, SwapRouter, Trade } from "@uniswap/v3-sdk";
import { ethers } from "ethers";
import { CurrentConfig } from "./config";
import {
  ERC20_ABI,
  MAX_FEE_PER_GAS,
  MAX_PRIORITY_FEE_PER_GAS,
  SWAP_ROUTER_ADDRESS,
  TOKEN_AMOUNT_TO_APPROVE_FOR_TRANSFER,
} from "./constants";
import {
  getProvider,
  getWalletAddress,
  sendTransaction,
  TransactionState,
} from "./providers";
import { fromReadableAmount } from "./utils";

export type TokenTrade = Trade<Token, Token, TradeType>;

export async function executeTrade(
  trade: TokenTrade // todo: find out which tradetype is used here
): Promise<TransactionState> {
  const walletAddress = getWalletAddress();
  const provider = getProvider();

  if (!walletAddress || !provider) {
    throw new Error("Cannot execute a trade without a connected wallet");
  }

  // Give approval to the router to spend the token
  const tokenApproval = await getTokenTransferApproval(CurrentConfig.tokens.in);

  // Fail if transfer approvals do not go through
  if (tokenApproval !== TransactionState.Sent) {
    return TransactionState.Failed;
  }

  const options: SwapOptions = {
    slippageTolerance: new Percent(50, 10_000), // 50 bips, or 0.50%
    deadline: Math.floor(Date.now() / 1000) + 60 * 20, // 20 minutes from the current Unix time
    recipient: walletAddress,
  };

  const methodParameters = SwapRouter.swapCallParameters([trade], options);

  const tx = {
    data: methodParameters.calldata,
    to: SWAP_ROUTER_ADDRESS,
    value: methodParameters.value,
    from: walletAddress,
    maxFeePerGas: MAX_FEE_PER_GAS,
    maxPriorityFeePerGas: MAX_PRIORITY_FEE_PER_GAS,
    gasLimit: 10000, // added - check if uncheckde Trade returns it
    gasPrice: 6000, // added - check if uncheckde Trade returns it
  };

  const res = await sendTransaction(tx);

  return res;
}

export async function getTokenTransferApproval(
  token: Token
): Promise<TransactionState> {
  const address = getWalletAddress();
  const provider = getProvider();
  if (!provider || !address) {
    console.log("No provider found");
    return TransactionState.Failed;
  }

  try {
    const tokenContract = new ethers.Contract(
      token.address,
      ERC20_ABI,
      provider
    );
    // Argument of type '"https://goerli.infura.io/v3/934530be9ec548fabe3d2b705ecf946f"' is not assignable to parameter of type 'Signer | Provider | undefined'.ts(2345)
    // try changing to method of getProvider()

    // why the need to approve? Is it sth to do with liquidity
    const transaction = await tokenContract.populateTransaction.approve(
      SWAP_ROUTER_ADDRESS,
      fromReadableAmount(
        TOKEN_AMOUNT_TO_APPROVE_FOR_TRANSFER,
        token.decimals
      ).toString()
    );

    return sendTransaction({
      ...transaction,
      from: address,
    });
  } catch (e) {
    console.error(e);
    return TransactionState.Failed;
  }
}
