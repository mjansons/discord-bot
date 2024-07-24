import { Router } from "express";
import { Database } from "@/database";
import { jsonRoute, unsupportedRoute } from "@/middleware/middleware";
import getRepositoryFunctions from "./messages.repository";
import getSprintRepositoryFunctions from "../sprints/sprints.repository";
import NotFound from "@/middleware/errors/NotFound";

export default (db: Database) => {
    const router = Router();
    const repository = getRepositoryFunctions(db);
    const sprintRepository = getSprintRepositoryFunctions(db);

    router
        .route("/")
        .get(
            jsonRoute(async (req) => {
                const { sprint, username } = req.query;

                if (sprint) {
                    if (
                        !(await sprintRepository.getSprintBySprintCode(
                            sprint as string
                        ))
                    ) {
                        throw new NotFound("Sprint Not Found");
                    }
                    return await repository.getAllSprintMessages(
                        sprint as string
                    );
                }
                if (username) {
                    return await repository.getUserMessages(username as string);
                }
                return repository.getAllSentMessages();
            })
        )
        .post(
            jsonRoute(async (req) => {
                const { sprintCode, username } = req.body;
                return await repository.sendCongratulations(
                    sprintCode as string,
                    username as string
                );
            })
        )
        .delete(unsupportedRoute)
        .patch(unsupportedRoute)
        .put(unsupportedRoute);

    return router;
};
