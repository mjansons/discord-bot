import { GuildMember } from 'discord.js';

interface MockGuildMember {
  user: {
    username: string;
    id: string;
  };
}

const mockSendMessage = vi.fn(
  async (message: string, url: string, channelId: string) => {
    console.log(
      `Mock sendMessage called with message: ${message}, url: ${url}, channelId: ${channelId}`
    );
  }
);

const mockGetUserFromDiscord = vi.fn(
  async (username: string): Promise<GuildMember | undefined> => {
    const userlist = ['mjansons', 'JohnDoe'];
    if (userlist.includes(username)) {
      const mockMember: MockGuildMember = {
        user: {
          username,
          id: 'mockUserId',
        },
      };
      return mockMember as GuildMember;
    }
    return undefined;
  }
);

// Mock default export
export default {
  sendMessage: mockSendMessage,
  getUserFromDiscord: mockGetUserFromDiscord,
};
