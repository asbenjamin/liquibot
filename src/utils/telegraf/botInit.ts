import { Telegraf } from "telegraf";
import { Configs } from "../../config";

const bot = new Telegraf(Configs.telegram_bot_token);

bot.start((ctx) => {
  let message = `Welcome, you will get Bybit Order logs here`;
  ctx.reply(message);
});

export async function sendMessage(chatId: string, message: any) {
  try {
    bot.telegram.sendMessage(chatId, message);
  } catch (error: any) {
    console.log(error);
  }
}

bot.launch;

export { bot };
