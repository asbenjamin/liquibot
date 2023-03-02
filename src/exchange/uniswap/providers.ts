import { BigNumber, ethers, providers } from "ethers";
import { CurrentConfig } from "./config";

export enum TransactionState {
  Failed = "Failed",
  New = "New",
  Rejected = "Rejected",
  Sending = "Sending",
  Sent = "Sent",
}

// Single copies of provider and wallet
const mainnetProvider = new ethers.providers.JsonRpcProvider(
  CurrentConfig.rpc.mainnet
);
const wallet = createWallet();

export async function sendTransaction(
  transaction: ethers.providers.TransactionRequest
): Promise<TransactionState> {
  if (transaction.value) {
    transaction.value = BigNumber.from(transaction.value);
  }
  return sendTransactionViaWallet(transaction);
}

async function sendTransactionViaWallet(
  transaction: ethers.providers.TransactionRequest
): Promise<TransactionState> {
  if (transaction.value) {
    transaction.value = BigNumber.from(transaction.value);
  }
  const txRes = await wallet.sendTransaction(transaction);

  let receipt = null;
  const provider = getProvider();
  if (!provider) {
    return TransactionState.Failed;
  }

  while (receipt === null) {
    try {
      receipt = await provider.getTransactionReceipt(txRes.hash);

      if (receipt === null) {
        continue;
      }
    } catch (e) {
      console.log(`Receipt error:`, e);
      break;
    }
  }

  // Transaction was successful if status === 1
  if (receipt) {
    return TransactionState.Sent;
  } else {
    return TransactionState.Failed;
  }
}

// create wallet
function createWallet(): ethers.Wallet {
  let provider = mainnetProvider;
  // provider = new ethers.providers.JsonRpcProvider(CurrentConfig.rpc.mainnet);
  return new ethers.Wallet(CurrentConfig.wallet.privateKey, provider);
}

export function getProvider(): providers.Provider | null {
  return wallet.provider;
}

export function getWalletAddress(): string | null {
  return wallet.address;
}
