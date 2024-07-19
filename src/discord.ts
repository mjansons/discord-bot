import "dotenv/config";
import { Client, GatewayIntentBits, TextChannel } from "discord.js";

const DISCORD_BOT_ID: string = process.env.DISCORD_BOT_ID as string;
const DISCORD_CHANNEL_ID: string = process.env.DISCORD_SERVER_ID as string;

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

// Event: When the bot is ready
client.on("ready", () => {
    console.log("Bot is ready!");
    sendMessage();
});

async function sendMessage() {
    try {
        const channel = (await client.channels.fetch(
            DISCORD_CHANNEL_ID
        )) as TextChannel;
        channel.send("Hello, this is a message from your bot!");
        console.log("Message sent!");
    } catch (error) {
        console.error("Error sending message:", error);
    }
}

client.login(DISCORD_BOT_ID);
