import 'dotenv/config';
import createApp from './app';
import createDatabase from './database';
import giphy from '@/services/giphy';
import discord from '@/services/discord';

const { DATABASE_URL } = process.env;
const PORT = 3000;

if (!DATABASE_URL) {
  throw new Error('Provide DATABASE_URL in your environment variables.');
}

const database = createDatabase(DATABASE_URL);
const app = createApp(database, giphy, discord);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running at http://localhost:${PORT}`);
});
