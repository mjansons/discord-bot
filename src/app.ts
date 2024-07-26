import express from 'express';
import helmet from 'helmet';
import messages from './modules/messages/messages.controller';
import templates from './modules/templates/templates.controller';
import sprints from './modules/sprints/sprints.controller';
import jsonErrorHandler from './middleware/errors';
import { type Database } from './database';
import { type GifService } from '@/services/giphy';
import { type DiscordService } from '@/services/discord';

export default function createApp(
  db: Database,
  giphy: GifService,
  discord: DiscordService
) {
  const app = express();
  app.use(helmet());
  app.use(express.json());

  app.use('/messages', messages(db, giphy, discord));
  app.use('/templates', templates(db));
  app.use('/sprints', sprints(db));

  app.use(jsonErrorHandler);

  return app;
}
