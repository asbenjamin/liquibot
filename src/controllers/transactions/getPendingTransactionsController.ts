import { ethers } from "ethers";
import { Request, Response } from "express";
import { Configs } from "../../config";
import uniswapAbi from "../../utils/uniswapAbi.json";
import erc20abi from "../../utils/erc20abi.json";
import uniswapv3Abi from "../../utils/uniswapV3RouterABI.json";

const API_KEY = Configs.infura_api_key;
const USDTAddress = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
const uniswapAddress = "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984";

export async function getPendingTransactions(req: Request, res: Response) {
  const provider = new ethers.providers.WebSocketProvider(
    `wss://goerli.infura.io/ws/v3/${API_KEY}`
  );

  try {
    const transactions: any = [];

    const erc20interface = new ethers.utils.Interface(uniswapv3Abi);

    let decode = (inputData: string) => {
      // console.log("\n", inputData)
      try {
        let txData = erc20interface.parseTransaction({
          data: inputData,
        });
        // console.log("\n\n\n  Got one ", txData);
        return txData;
      } catch (error) {
        console.log(error);
      }
    };

    console.log(
      "=======================",
      decode(
        "0x5ae401dc0000000000000000000000000000000000000000000000000000000061d7ae4000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000e4472b43f3000000000000000000000000000000000000000000000000000000000098968000000000000000000000000000000000000000000000000000000093eae0b05600000000000000000000000000000000000000000000000000000000000000800000000000000000000000001ed7f11679a47ac259fb7dd86a862a92bf0523e00000000000000000000000000000000000000000000000000000000000000002000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2000000000000000000000000ff20817765cb7f73d4bde2e66e067e58d11095c200000000000000000000000000000000000000000000000000000000"
      ),
      await provider.getTransaction(
        "0xa8ed965aaac61bb98eb2686db70e6443c06ea6549340d882a0f68644850d380e"
      )
    );

    provider.on("pending", async (tx) => {
      const txtInfo = await provider.getTransaction(tx);

      if (txtInfo && txtInfo.to && txtInfo.data != "0x") {
        const contractAddress = txtInfo.to;
        const byteCode = await provider.getCode(contractAddress);
        const gas = txtInfo.gasLimit.toNumber();
        const gasPrice = txtInfo.gasPrice?.toNumber();
        const maxFeePerGas = txtInfo.maxFeePerGas?.toNumber();
        const decodedData = decode(txtInfo.data);

        transactions.push({
          transactionHash: txtInfo.hash,
          toAddress: contractAddress,
          byteCode: byteCode,
          gas: gas,
          gasPrice: gasPrice,
          maxFeePerGas: maxFeePerGas,
          decoded: decodedData,
        });

        if (decodedData && decodedData.name == "addLiquididty") {
          console.log("Yeessssssssssssssss");
          // buy the token automatically logic (log the data to the bot UI)
        }
      }
    });

    setTimeout(() => {
      provider.removeAllListeners();
      if (transactions.length > 0) {
        res.status(200).json(transactions);
      } else {
        res.status(400).json({
          message: "No pending transactions found",
        });
      }
    }, 5000);
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(400).json({
      message: "An error occurred",
      error: error,
    });
  }
}
