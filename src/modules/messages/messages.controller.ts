import { Router } from 'express';
import { Database } from '@/database';
import { jsonRoute, unsupportedRoute } from '@/middleware/middleware';
import { type GifService } from '@/services/giphy';
import { type DiscordService } from '@/services/discord';
import { StatusCodes } from 'http-status-codes';
import { parseSprintCode, parseUsername } from './messages.schema';
import getRepositoryFunctions from './messages.repository';
import getSprintRepositoryFunctions from '../sprints/sprints.repository';
import getTempleatesRepositoryFunctions from '../templates/templates.repository';
import getUserRepositoryFunctions from '../users/users.repository';
import NotFound from '@/middleware/errors/NotFound';
import BadRequest from '@/middleware/errors/BadRequest';
import 'dotenv/config';

export default (
  db: Database,
  getRandomGif: GifService,
  discord: DiscordService
) => {
  const router = Router();
  const repository = getRepositoryFunctions(db);
  const sprintRepository = getSprintRepositoryFunctions(db);
  const userRepository = getUserRepositoryFunctions(db);
  const templateRepository = getTempleatesRepositoryFunctions(db);

  router
    .route('/')
    .get(
      jsonRoute(async (req) => {
        const { sprint, username } = req.query;

        if (sprint) {
          parseSprintCode(sprint);
          // gets all sent messages for a specific sprint
          if (!(await sprintRepository.getSprintBySprintCode(sprint as string)))
            throw new NotFound('Sprint Not Found');
          return await repository.getAllSprintMessages(sprint as string);
        }
        if (username) {
          parseUsername(username);
          // gets all sent messages for a specific user
          if (!(await userRepository.getUserByUsername(username as string)))
            throw new NotFound('User Not Found');
          return await repository.getUserMessages(username as string);
        }
        // gets all sent messages
        return repository.getAllSentMessages();
      })
    )
    .post(
      jsonRoute(async (req) => {
        const { sprintCode, username } = req.body;
        if (!sprintCode) throw new NotFound('Sprint code is required');
        if (!username) throw new NotFound('Username is required');

        parseSprintCode(sprintCode);
        parseUsername(username);
        // such sprint exists?
        const sprintObject = await sprintRepository.getSprintBySprintCode(
          sprintCode as string
        );
        if (!sprintObject) throw new NotFound('Sprint Not Found');

        // such user exists in Discord?
        const userDiscordObject = await discord.getUserFromDiscord(username);
        if (!userDiscordObject) {
          throw new NotFound('User Not Found in Discord channel');
        }

        let userObject = await userRepository.getUserByUsername(
          username as string
        );

        // such user exists in DB?
        if (!userObject) {
          userObject = await userRepository.addNewUser(username);
        } else {
          // if yes, has user already finished the sprint?
          if (await sprintRepository.getCompletedSprint(sprintCode, username)) {
            throw new BadRequest('User has already finished the sprint');
          }
        }

        // get a template from db
        const allTemplates = await templateRepository.getAllTemplates();

        if (allTemplates.length === 0) {
          throw new NotFound('No templates found.');
        }

        const randomIndex = Math.floor(Math.random() * allTemplates.length);
        const templateObject = allTemplates[randomIndex];

        // update completed sprints in db

        if (
          !sprintRepository.updateCompletedSprint(
            sprintObject.id,
            userObject!.id
          )
        ) {
          throw new Error('Sent message not saved in history');
        }

        // fetch a gif
        const gifURL = await getRandomGif(
          process.env.GIPHY_API_KEY as string,
          'success'
        );

        const message = `${userDiscordObject} has just completed ${sprintObject.title}! ${templateObject.message}`;

        discord.sendMessage(
          message,
          gifURL,
          process.env.DISCORD_CHANNEL_ID as string
        );

        // update sent_messages in db
        if (
          !(await repository.addSentMessage(
            sprintObject.id,
            templateObject.id,
            userObject!.id
          ))
        ) {
          throw new Error('Sent message not saved in history');
        }
        return { message: 'Message sent successfully' };
      }, StatusCodes.CREATED)
    )
    .delete(unsupportedRoute)
    .patch(unsupportedRoute)
    .put(unsupportedRoute);

  return router;
};
