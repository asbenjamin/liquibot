import { ethers } from "ethers";
import { Request, Response } from "express";
import { Configs } from "../../config";
import abiSample from "../../utils/abisample.json"

const API_KEY = Configs.infura_api_key;

export async function getPendingTransactions(req: Request, res: Response) {
  const provider = new ethers.providers.WebSocketProvider(
    `wss://goerli.infura.io/ws/v3/${API_KEY}`
  );

  try {
    const transactions: any = [];

    const erc20interface = new ethers.utils.Interface(abiSample);

    let decode = (txHash: string, inputData: string) => {
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

    provider.on("pending", async (tx) => {
      const txtInfo = await provider.getTransaction(tx);

      if (txtInfo && txtInfo.to && txtInfo.data != "0x") {
        const contractAddress = txtInfo.to;
        const byteCode = await provider.getCode(contractAddress);
        const gas = txtInfo.gasLimit.toNumber();
        const gasPrice = txtInfo.gasPrice?.toNumber();
        const maxFeePerGas = txtInfo.maxFeePerGas?.toNumber();
        const decodedData = decode(txtInfo.hash, txtInfo.data);

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
