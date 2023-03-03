import {
  Currency,
  CurrencyAmount,
  Percent,
  Token,
  TradeType,
} from "@uniswap/sdk-core";
import {
  Pool,
  Route,
  SwapOptions,
  SwapQuoter,
  SwapRouter,
  Trade,
} from "@uniswap/v3-sdk";
import { ethers } from "ethers";
import { CurrentConfig } from "./config";
import JSBI from "jsbi";
import {
  ERC20_ABI,
  MAX_FEE_PER_GAS,
  MAX_PRIORITY_FEE_PER_GAS,
  QUOTER_CONTRACT_ADDRESS,
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
import { getPoolInfo } from "./pool";

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

  console.log("naaaaa");

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

  console.log("============", methodParameters);

  const tx = {
    data: methodParameters.calldata,
    to: SWAP_ROUTER_ADDRESS,
    value: methodParameters.value,
    from: walletAddress,
    maxFeePerGas: MAX_FEE_PER_GAS,
    maxPriorityFeePerGas: MAX_PRIORITY_FEE_PER_GAS,
    gasLimit: 100000000000, // added - check if uncheckde Trade returns it
    gasPrice: 5000000, // added - check if uncheckde Trade returns it
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
    console.log("active???", transaction);

    const result: any = await sendTransaction({
      ...transaction,
      from: address,
    });
    return result;
  } catch (e) {
    console.error(e);
    return TransactionState.Failed;
  }
}

export async function createTrade(): Promise<TokenTrade> {
  console.log("we are here");
  const poolInfo = await getPoolInfo();

  console.log("Next");
  const pool = new Pool(
    CurrentConfig.tokens.in, // WETH
    CurrentConfig.tokens.out, // USDC_TOKEN
    CurrentConfig.tokens.poolFee, // MEDIUM
    poolInfo.sqrtPriceX96.toString(), // The sqrt of the current ratio of amounts of token1 to token0
    poolInfo.liquidity.toString(),
    poolInfo.tick
  );

  const swapRoute = new Route(
    [pool],
    CurrentConfig.tokens.in,
    CurrentConfig.tokens.out
  );

  const amountOut = await getOutputQuote(swapRoute); // amount of output tokens that the trade will receive for a given amount of input tokens
  console.log(amountOut);

  const uncheckedTrade = Trade.createUncheckedTrade({
    route: swapRoute,
    inputAmount: CurrencyAmount.fromRawAmount(
      CurrentConfig.tokens.in,
      fromReadableAmount(
        CurrentConfig.tokens.amountIn,
        CurrentConfig.tokens.in.decimals
      ).toString()
    ),
    outputAmount: CurrencyAmount.fromRawAmount(
      CurrentConfig.tokens.out,
      JSBI.BigInt(amountOut)
    ),
    tradeType: TradeType.EXACT_INPUT,
  });

  console.log(uncheckedTrade);
  return uncheckedTrade;
}

async function getOutputQuote(route: Route<Currency, Currency>) {
  const provider = getProvider();

  if (!provider) {
    throw new Error("Provider required to get pool state");
  }

  const { calldata } = await SwapQuoter.quoteCallParameters(
    route,
    CurrencyAmount.fromRawAmount(
      CurrentConfig.tokens.in,
      fromReadableAmount(
        CurrentConfig.tokens.amountIn,
        CurrentConfig.tokens.in.decimals
      ).toString()
    ),
    TradeType.EXACT_INPUT,
    {
      useQuoterV2: true,
    }
  );

  const quoteCallReturnData = await provider.call({
    to: QUOTER_CONTRACT_ADDRESS,
    data: calldata,
  });

  return ethers.utils.defaultAbiCoder.decode(["uint256"], quoteCallReturnData);
}
