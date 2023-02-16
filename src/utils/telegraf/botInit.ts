import axios from "axios";
import { Markup, Telegraf, Context } from "telegraf";
import { Configs } from "../../config";
import { bybitService } from "../initBybit";
import { sendMessage } from "../message";
import { Redis } from "ioredis";

const redis = new Redis();

const bot = new Telegraf<Context>(Configs.telegram_bot_token);

bot.start((ctx) => {
  ctx.reply(
    `Welcome to the Bybit bot, ${ctx.from.first_name}, you can press the menu for some actions to take`
  );
});

bot.action("placeordereth", async (ctx) => {
  try {
    ctx.reply(`Placing your order...`);
    console.log("here we are, placing your order");

    const orderData = {
      symbol: "ETHUSDT",
      side: await redis.get("orderSide"),
      order_type: await redis.get("orderType"),
      qty: Number(await redis.get("qty")),
      time_in_force: "GoodTillCancel",
      close_on_trigger: false,
    };

    const lastTradedPrice = await bybitService.getLastTradedPrice("ETHUSDT");
    let reduce_only = orderData.side === "Buy" ? false : true;
    let price =
      orderData.side === "Buy"
        ? lastTradedPrice.lastTradedPrice - 0.05
        : lastTradedPrice.lastTradedPrice + 0.05;

    try {
      let result;
      if (orderData.order_type === "Market") {
        result = await bybitService.placeOrder(
          orderData.symbol,
          orderData.side,
          orderData.order_type,
          orderData.qty,
          orderData.time_in_force,
          typeof price !== "undefined" ? price : undefined,
          reduce_only,
          orderData.close_on_trigger
        );
      } else
        result = await bybitService.placeOrder(
          orderData.symbol,
          orderData.side,
          orderData.order_type,
          orderData.qty,
          orderData.time_in_force,
          price,
          reduce_only,
          orderData.close_on_trigger
        );
    } catch (err) {
      console.error(err);
    }

    sendMessage(
      Configs.bybit_bot_chat_id,
      `Purchase order for ${orderData.qty} eth placed successfully`
    );
    await redis.flushall();
  } catch (error) {
    console.error(error);
    sendMessage(
      Configs.bybit_bot_chat_id,
      `An error occurred while placing your order: ${error}`
    );
  }
});

bot.command("getbalance", async (ctx) => {
  try {
    console.log("here we are");

    await axios
      .get("http://localhost:3000/api/get-balance")
      .then((response) => {
        console.log(response.data);
        return response.data;
      })
      .catch((error) => {
        console.error(error);
      });
  } catch (error) {
    console.error(error);
    sendMessage(
      Configs.bybit_bot_chat_id,
      `An error occurred while placing your order: ${error}`
    );
  }
});

bot.command("placeorder", (ctx) => {
  ctx.reply(
    `Select the order type, ${ctx.from.first_name}?`,
    Markup.inlineKeyboard([
      Markup.button.callback("Place Limit Order", "Limit_Order"),
      Markup.button.callback("Place Market Order", "Market_Order"),
    ])
  );
});

bot.action("Limit_Order", async (ctx) => {
  await redis.set("orderType", "Limit");

  ctx.reply(
    `Do you want to Buy or Sell`,
    Markup.inlineKeyboard([
      Markup.button.callback("🤑 Buy Some", "Buy"),
      Markup.button.callback("💱 Sell Some", "Sell"),
    ])
  );
});

bot.action("Buy", async (ctx) => {
  await redis.set("orderSide", "Buy");

  ctx.reply(
    `How much do you want`,
    Markup.inlineKeyboard([Markup.button.callback("💱 Buy 5", "Buy_Five")])
  );
});

bot.action("Buy_Five", async (ctx) => {
  await redis.set("qty", "5");

  ctx.reply(
    `Please confirm that you want to place a ${await redis.get(
      "orderType"
    )} ${await redis.get("orderSide")} order of ${await redis.get(
      "qty"
    )} ETHUSDT`,

    Markup.inlineKeyboard([
      Markup.button.callback("💱 Confirm Order", "placeordereth"),
    ])
  );
  console.log(await redis.get("orderSide"));
  console.log(await redis.get("orderType"));
  console.log(await redis.get("qty"));
});

bot.command("showdata", async (ctx) => {
  try {
    // Retrieve all keys
    const keys = await redis.keys("*");

    if (keys.length === 0) {
      ctx.reply("No data found.");
      return;
    }

    // Retrieve the value for each key and create a response message
    let message = "Available data:\n";
    for (const key of keys) {
      const value = await redis.get(key);
      message += `${key}: ${value}\n`;
    }

    // Send the response message
    ctx.reply(message);
  } catch (error) {
    console.error(error);
    ctx.reply("An error occurred.");
  }
});

bot.launch;

export { bot };
