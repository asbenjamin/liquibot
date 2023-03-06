import { AlphaRouter, SwapType } from "@uniswap/smart-order-router";
import {
  Token,
  CurrencyAmount,
  TradeType,
  Percent,
  BigintIsh,
} from "@uniswap/sdk-core";
import { ethers, BigNumber } from "ethers";
import JSBI from "jsbi";
import { ERC20_ABI } from "./uniswap/constants";
import { Configs } from "../config";

const V3_SWAP_ROUTER_ADDRESS = "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45";
const REACT_APP_INFURA_URL_TESTNET = process.env.REACT_APP_INFURA_URL_TESTNET;

const chainId = 3;

const web3Provider = new ethers.providers.JsonRpcProvider(
  Configs.infura_https_api_key
);
const router = new AlphaRouter({ chainId: chainId, provider: web3Provider });

const name0 = "Wrapped Ether";
const symbol0 = "WETH";
const decimals0 = 18;
const address0 = "0xc778417e063141139fce010982780140aa0cd5ab";

const name1 = "Uniswap Token";
const symbol1 = "UNI";
const decimals1 = 18;
const address1 = "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984";

const WETH = new Token(chainId, address0, decimals0, symbol0, name0);
const UNI = new Token(chainId, address1, decimals1, symbol1, name1);

export const getWethContract = () =>
  new ethers.Contract(address0, ERC20_ABI, web3Provider);
export const getUniContract = () =>
  new ethers.Contract(address1, ERC20_ABI, web3Provider);

export const getPrice = async (
  inputAmount: number,
  slippageAmount: BigintIsh,
  deadline: any,
  walletAddress: any
) => {
  const percentSlippage = new Percent(slippageAmount, 100);
  const wei = ethers.utils.parseUnits(inputAmount.toString(), decimals0);
  const currencyAmount = CurrencyAmount.fromRawAmount(WETH, JSBI.BigInt(wei));

  const route = await router.route(currencyAmount, UNI, TradeType.EXACT_INPUT, {
    type: SwapType.SWAP_ROUTER_02,
    recipient: walletAddress,
    slippageTolerance: percentSlippage,
    deadline: deadline,
  });

  const transaction = {
    data: route?.methodParameters?.calldata,
    to: V3_SWAP_ROUTER_ADDRESS,
    value: BigNumber.from(route?.methodParameters?.value),
    from: walletAddress,
    gasPrice: BigNumber.from(route?.gasPriceWei),
    gasLimit: ethers.utils.hexlify(1000000),
  };

  const quoteAmountOut = route?.quote.toFixed(6);
  if (quoteAmountOut) {
    const ratio: any = (inputAmount / parseFloat(quoteAmountOut)).toFixed(3);
    return [transaction, quoteAmountOut, ratio];
  }
};

export const runSwap = async (transaction: any, signer: any) => {
  const approvalAmount = ethers.utils.parseUnits("10", 18).toString();
  const contract0 = getWethContract();
  await contract0
    .connect(signer)
    .approve(V3_SWAP_ROUTER_ADDRESS, approvalAmount);

  signer.sendTransaction(transaction);
};
