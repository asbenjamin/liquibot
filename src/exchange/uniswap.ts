import { ethers } from "ethers";
import { Configs } from "../config";
import abiSample from "../utils/uniswapAbi.json";

const API_KEY = Configs.infura_api_key;

const provider = new ethers.providers.WebSocketProvider(
  `wss://goerli.infura.io/ws/v3/${API_KEY}`
);

//
const unisWapExchangeAddress = "";
const unisWapExchangeAbi = abiSample;
const unisWapExchange = new ethers.Contract(
  unisWapExchangeAddress,
  unisWapExchangeAbi
);

// ERC-20 token we want to trade
const tokenAddress = "";
const tokenABI = abiSample; // replace with correct
const token = new ethers.Contract(tokenAddress, tokenABI);

// get exchange rate - e.g. current price of DAI in ETH
// returns eth amt to send to uniswap to get 1 Dai
async function getDaiEthPrice() {
  const daiEthPrice = await unisWapExchange.getTokenInputPrice(
    ethers.utils.parseUnits("1", 18)
  );
  return daiEthPrice;
}
const daiEthPrice = getDaiEthPrice;

// tokens to trade based on exch rate
// e.g to buy 100 DAI with eth
const ethAmount = ethers.utils.parseUnits("1", 18);
const daiAmount = await unisWapExchange.getEthTokenInputPrice(ethAmount);
const daiAmountWithSlippage = daiAmount.mul(99).div(100);

// approve uni exch to spend tokens by calling ERC-20 tokens approve fn
const approveTx = await token.approve(
  unisWapExchangeAddress,
  daiAmountWithSlippage
);
await approveTx.wait();

// Call uni contract swap fn with necessary args to exec the trade
const swapTx = await unisWapExchange.swapExtactTokensForETH(
  daiAmountWithSlippage,
  ethers.utils.parseUnits("0.1", 18),
  [tokenAddress, ethers.constants.AddressZero]
);
