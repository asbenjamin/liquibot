import { Telegraf } from "telegraf";
import { Configs } from "../../config";
import { normaliseMessage } from "../normalize";
import axios from "axios";

const bot = new Telegraf(Configs.telegram_bot_token);

bot.start((ctx) => {
  let message = `Welcome, you will get Bybit Order logs here`;
  ctx.reply(message);
});

bot.command("/placeorder", async (ctx) => {
  try {
    console.log("here we are");

    const input = JSON.parse(ctx.message.text.split(" ").slice(1).join(" "));
    const { symbol, side, order_type, qty, time_in_force, close_on_trigger } =
      input;

    const orderData = {
      symbol,
      side,
      order_type,
      qty,
      time_in_force,
      close_on_trigger,
    };

    console.log({
      symbol,
      side,
      order_type,
      qty,
      time_in_force,
      close_on_trigger,
    });

    await axios
      .post("http://localhost:3000/api/place-order", orderData)
      .then((response) => {
        console.log(response.data);
        return response.data
      })
      .catch((error) => {
        console.error(error);
      });

    // Handle the result and send a message back to the user
    sendMessage(
      Configs.bybit_bot_chat_id,
      `Order placed successfully with symbol - ${symbol}, side - ${side}, order_type - ${order_type}, qty - ${qty}, time in force - ${time_in_force}, and close on trigger - ${close_on_trigger}`
    );
  } catch (error) {
    // Handle any errors that occurred
    console.error(error);
    sendMessage(
      Configs.bybit_bot_chat_id,
      `An error occurred while placing your order: ${error}`
    );
  }
});

export async function sendMessage(chatId: string, message: any) {
  try {
    bot.telegram.sendMessage(chatId, normaliseMessage(message), {
      parse_mode: "MarkdownV2",
    });
  } catch (error: any) {
    console.log(error);
  }
}

bot.launch;

export { bot };
