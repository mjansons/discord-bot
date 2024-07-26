import { Router } from 'express';
import { Database } from '@/database';
import { StatusCodes } from 'http-status-codes';
import BadRequest from '@/middleware/errors/BadRequest';
import NotFound from '@/middleware/errors/NotFound';
import { jsonRoute, unsupportedRoute } from '@/middleware/middleware';
import getRepositoryFunctions from './sprints.repository';
import { parseSprintCode, parseTitle } from './sprints.schema';

export default (db: Database) => {
  const router = Router();

  const repository = getRepositoryFunctions(db);

  router
    .route('/')
    .get(jsonRoute(repository.getAllSprints))
    .post(
      jsonRoute(async (req) => {
        const { sprintCode, title } = req.body;

        parseSprintCode(sprintCode);
        parseTitle(title);

        // unique constraint validation
        if (await repository.getSprintBySprintCode(sprintCode)) {
          throw new BadRequest('Please provide a unique Sprint Code');
        }
        if (await repository.getSprintBySprintTitle(title)) {
          throw new BadRequest('Please provide a unique Sprint Title');
        }

        return repository.addNewSprint(sprintCode, title);
      }, StatusCodes.CREATED)
    )

    .patch(
      jsonRoute(async (req) => {
        const { sprint } = req.query;
        const { newSprintCode, newTitle } = req.body;

        parseSprintCode(sprint);

        if (!(await repository.getSprintBySprintCode(sprint as string))) {
          throw new NotFound('Sprint Not Found');
        }

        if (newSprintCode) {
          parseSprintCode(newSprintCode);
          if (await repository.getSprintBySprintCode(newSprintCode)) {
            throw new BadRequest('Please provide a unique New Sprint Code');
          }
          return repository.updateSprintCode(sprint as string, newSprintCode);
        }
        if (newTitle) {
          parseTitle(newTitle);
          if (await repository.getSprintBySprintTitle(newTitle)) {
            throw new BadRequest('Please provide a unique New Sprint Title');
          }
          return repository.updateSprintTitle(sprint as string, newTitle);
        }
      })
    )

    .delete(
      jsonRoute(async (req) => {
        const { sprint } = req.query;

        parseSprintCode(sprint);

        if (!(await repository.getSprintBySprintCode(sprint as string))) {
          throw new NotFound('Sprint Not Found');
        }

        return repository.deleteSprint(sprint as string);
      })
    )
    .put(unsupportedRoute);

  return router;
};
