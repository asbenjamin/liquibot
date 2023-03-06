// import { ethers } from "ethers";
// import { Token, TradeType, Percent } from "@uniswap/sdk-core";
// import { Route, Trade, TokenAmount } from "@uniswap/v3-sdk";
// import { SwapRouter } from "@uniswap/v3-sdk";
// import { abi as SWAP_ROUTER_ABI } from "@uniswap/v3-periphery/artifacts/contracts/SwapRouter.sol/SwapRouter.json";

// // Set up provider and signer
// const provider = new ethers.providers.JsonRpcProvider();
// const signer = provider.getSigner();

// // Set up router contract
// const SWAP_ROUTER_ADDRESS = "0xE592427A0AEce92De3Edee1F18E0157C05861564"; // Replace with correct router address
// const swapRouter = new ethers.Contract(
//   SWAP_ROUTER_ADDRESS,
//   SWAP_ROUTER_ABI,
//   signer
// ) as SwapRouter;

// // Token addresses
// const USDC_ADDRESS = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"; // USDC address on Ethereum mainnet
// const WETH_ADDRESS = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"; // WETH address on Ethereum mainnet

// // Create token objects
// const usdc = new Token(1, USDC_ADDRESS, 6);
// const weth = new Token(1, WETH_ADDRESS, 18);

// async function swapTokens() {
//   // Set up trade
//   const usdcAmountIn = new TokenAmount(usdc, "1000");
//   const route = await Route.fetchExact(
//     usdcAmountIn,
//     weth,
//     swapRouter.provider // Use Uniswap v3 provider
//   );
//   const trade = new Trade(route, usdcAmountIn, TradeType.EXACT_INPUT);

//   // Calculate slippage tolerance
//   const slippageTolerance = new Percent("50", "10000"); // 0.5%

//   // Set up swap options
//   const deadline = Math.floor(Date.now() / 1000) + 60 * 10; // 10 minutes from now
//   const amountOutMinimum = trade
//     .minimumAmountOut(slippageTolerance)
//     .raw.toString();

//   // Call swap function
//   const tx = await swapRouter.exactInputSingle({
//     tokenIn: usdc.address,
//     tokenOut: weth.address,
//     fee: 3000,
//     recipient: await signer.getAddress(),
//     deadline: deadline.toString(),
//     amountIn: usdcAmountIn.raw.toString(),
//     amountOutMinimum: amountOutMinimum,
//     sqrtPriceLimitX96: 0,
//   });

//   console.log(`Transaction hash: ${tx.hash}`);
// }

// swapTokens();
