import { Command } from "commander";

type TelegramResponse = {
    ok: boolean;
    result?: {
        message_id?: number;    
    };
    description?: string;
};

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

    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
      }),
    });
   
    const data = (await response.json()) as TelegramResponse;

    if (!response.ok || !data.ok) {
        const detail = data.description ?? response.statusText;
        console.error(`Telegram API request failed: ${detail}`);
        process.exit(1);
    }

    const messageId = data.result?.message_id;

    console.log(`Sent Telegram message to chat ${chatId}`);

    if (messageId !== undefined) {
        console.log(`Telegram Message ID: ${messageId}`);
    }

  });

program.parseAsync(process.argv);

// the link to get updates from the bot, which can be useful for debugging or checking the bot's activity
// https://api.telegram.org/bot{token}getUpdates