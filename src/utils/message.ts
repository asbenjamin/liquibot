import { normaliseMessage } from "./normalize";
import { bot } from "./telegraf/botInit";

export async function sendMessage(chatId: string, message: any) {
  try {
    bot.telegram.sendMessage(chatId, normaliseMessage(message), {
      parse_mode: "MarkdownV2",
    });
  } catch (error: any) {
    console.log(error);
  }
}
