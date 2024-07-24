import { Router } from "express";
import { Database } from "@/database";
import { jsonRoute, unsupportedRoute } from "@/middleware/middleware";
import { StatusCodes } from "http-status-codes";
import BadRequest from "@/middleware/errors/BadRequest";
import NotFound from "@/middleware/errors/NotFound";

import getRepositoryFunctions from "./users.repository";

export default (db: Database) => {
    const router = Router();

    const repository = getRepositoryFunctions(db);

    router
        .route("/")
        .get(jsonRoute(repository.getAllTemplates))
        .post(
            jsonRoute(async (req) => {
                const { username } = req.body;

                if (await repository.getUserByUsername(username as string)) {
                    throw new BadRequest("Please provide a unique username!");
                }

                return repository.addNewUser(username);
            }, StatusCodes.CREATED)
        )

        .patch(
            jsonRoute(async (req) => {
                const id = parseInt(req.query.id as string, 10);

                if (!(await repository.getUserById(id as number))) {
                    throw new NotFound("User with such ID Not Found!");
                }

                const { newUsername } = req.body;

                if (
                    await repository.getUserByUsername(newUsername as string)
                ) {
                    throw new BadRequest(
                        "Please provide a unique new username!"
                    );
                }

                return repository.updateUsername(id, newUsername);
            })
        )
        .delete(
            jsonRoute(async (req) => {
                const id = parseInt(req.query.id as string, 10);

                if (!(await repository.getUserById(id as number))) {
                    throw new NotFound("User with such ID Not Found!");
                }

                return repository.deleteUser(id);
            })
        )
        .put(unsupportedRoute);

    return router;
};
