import "dotenv/config";
import { Client, GatewayIntentBits, TextChannel } from "discord.js";

const DISCORD_BOT_ID: string = process.env.DISCORD_BOT_ID as string;
const DISCORD_CHANNEL_ID: string = process.env.DISCORD_CHANNEL_ID as string;

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

export function sendMessage(
    message = "Hello, this is a message from your bot!",
    channel = DISCORD_CHANNEL_ID
) {
    client.on("ready", async () => {
        console.log("Bot is ready!");
        try {
            const channel = (await client.channels.fetch(
                DISCORD_CHANNEL_ID
            )) as TextChannel;
            channel.send(message);
            console.log("Message sent!");
        } catch (error) {
            console.error("Error sending message:", error);
        }
    });
}

client.login(DISCORD_BOT_ID);
