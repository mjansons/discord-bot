import { Router } from 'express';
import { Database } from '@/database';
import { jsonRoute, unsupportedRoute } from '@/middleware/middleware';
import { StatusCodes } from 'http-status-codes';
import BadRequest from '@/middleware/errors/BadRequest';
import NotFound from '@/middleware/errors/NotFound';
import { parseId, parseMessage } from './templates.schema';

import getRepositoryFunctions from './templates.repository';

export default (db: Database) => {
  const router = Router();

  const repository = getRepositoryFunctions(db);

  router
    .route('/')
    .get(jsonRoute(repository.getAllTemplates))
    .post(
      jsonRoute(async (req) => {
        const { message } = req.body;

        parseMessage(message);

        if (await repository.getTemplateByMessage(message as string)) {
          throw new BadRequest('Please provide a unique message!');
        }

        return repository.addNewTemplate(message);
      }, StatusCodes.CREATED)
    )

    .patch(
      jsonRoute(async (req) => {
        parseId(req.query.id);
        const id = parseInt(req.query.id as string, 10);

        if (!(await repository.getTemplateById(id as number))) {
          throw new NotFound('Template with such ID Not Found!');
        }

        const { newMessage } = req.body;

        parseMessage(newMessage);

        if (await repository.getTemplateByMessage(newMessage as string)) {
          throw new BadRequest('Please provide a unique new message!');
        }

        return repository.updateTemplateMessage(id, newMessage);
      })
    )
    .delete(
      jsonRoute(async (req) => {
        parseId(req.query.id);
        const id = parseInt(req.query.id as string, 10);

        if (!(await repository.getTemplateById(id as number))) {
          throw new NotFound('Template with such ID Not Found!');
        }

        return repository.deleteTemplate(id);
      })
    )
    .put(unsupportedRoute);

  return router;
};
