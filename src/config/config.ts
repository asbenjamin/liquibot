import "dotenv/config";

export const Configs = {
  key: process.env.TEST_BYBIT_API_KEY! || "",
  secret: process.env.TEST_BYBIT_API_SECRET! || "",
  baseUrl: process.env.TEST_URL! || "",
  infura_api_key: process.env.INFURA_API_KEY! || "",
  telegram_bot_token: process.env.BYBIT_BOT_TOKEN! || "",
  application_port: process.env.APP_PORT! || "",
  bybit_bot_chat_id: process.env.BYBIT_BOT_CHAT_ID! || "",
  wallet_private_key: process.env.WALLET_PRIVATE_KEY! || "",
  wallet_address: process.env.WALLET_ADDRESS! || "",
  infura_https_api_key: process.env.INFURA_HTTPS_API_KEY,
};
