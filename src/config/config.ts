import "dotenv/config";

export const Configs = {
  key: process.env.TEST_BYBIT_API_KEY! || "",
  secret: process.env.TEST_BYBIT_API_SECRET! || "",
  baseUrl: process.env.TEST_URL! || "",
  infura_api_key: process.env.INFURA_API_KEY! || "",
};
