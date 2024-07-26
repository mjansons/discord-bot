import {
  Client,
  GatewayIntentBits,
  TextChannel,
  GuildMember,
} from 'discord.js';
import 'dotenv/config';

const DISCORD_BOT_ID: string = process.env.DISCORD_BOT_ID as string;
const DISCORD_SERVER_ID: string = process.env.DISCORD_SERVER_ID as string;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

async function ensureClientReady(botId: string) {
  if (!client.isReady()) {
    return new Promise<void>((resolve, reject) => {
      client.once('ready', () => {
        console.log(`Logged in as ${client.user?.tag}!`);
        resolve();
      });

      client.login(botId).catch(reject);
    });
  }
}

export default {
  async sendMessage(message: string, url: string, channelId: string) {
    try {
      await ensureClientReady(DISCORD_BOT_ID);
      const channel = await client.channels.fetch(channelId);
      const textChannel = channel as TextChannel;
      textChannel.send({
        content: message,
        files: [url],
      });
      console.log('Message sent!');
    } catch (error) {
      throw new Error(`Failed to send Discord message. Error: ${error}`);
    }
  },
  async getUserFromDiscord(username: string): Promise<GuildMember | undefined> {
    try {
      await ensureClientReady(DISCORD_BOT_ID);
      const guild = await client.guilds.fetch(DISCORD_SERVER_ID);
      const users = await guild.members.fetch();

      const user = users.find((member) => member.user.username === username);
      return user;
    } catch (error) {
      throw new Error(`Discord user search failed. Error: ${error}`);
    }
  },
};

export type DiscordService = {
  sendMessage: (
    message: string,
    url: string,
    channelId: string
  ) => Promise<void>;
  getUserFromDiscord: (username: string) => Promise<GuildMember | undefined>;
};
