import { Command } from "commander";
import { sendTelegramMessage } from "sendkit-core";



const program = new Command();

program
  .name("sendkit")
  .description("A CLI tool for SendKit")
  .command("telegram")
  .description("Send messages via Telegram")
  .argument("<chatId>", "Chat ID to send the message to")
  .argument("<message>", "Message to send")
  .action(async(chatId: string, message: string) => {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (!token) {
      console.error("Error: TELEGRAM_BOT_TOKEN is not set in the environment variables.");
      process.exit(1);
    }

    if (!chatId || !message) {
      console.error("Error: Both chatId and message are required.");
      process.exit(1);
    }

    try {
      const result = await sendTelegramMessage({
        botToken: token,
        chatId,
        message,
      });

      console.log(`Sent Telegrram messge to chat ${result.chatId} with message ID ${result.chatId}`);
      console.log(`Telegram message ID: ${result.messageId}`);

    } catch (error) {
      const detail = error instanceof Error ? error.message : String(error);
      console.error(`Telegram API request failed: ${detail}`);
      process.exit(1);
    }
  });

program.parseAsync(process.argv);

// the link to get updates from the bot, which can be useful for debugging or checking the bot's activity
// https://api.telegram.org/bot{token}getUpdates