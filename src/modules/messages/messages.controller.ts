import { Router } from "express";
import { Database, Templates } from "@/database";
import getRepositoryFunctions from "./messages.repository";

export default (db: Database) => {
    const router = Router();

    const repository = getRepositoryFunctions(db);

    router
        .route("/")
        .get(async (req, res) => {
            const { sprint, username } = req.query;

            if (sprint) {
                const result = await repository.getAllSprintMessages(
                    sprint as string
                );
                res.send(result);
                return;
            }
            if (username) {
                const result = await repository.getUserMessages(
                    username as string
                );
                res.send(result);
                return;
            }
            const result = await repository.getAllSentMessages();
            res.send(result);
        })
        .post(async (req, res) => {
            const { sprintCode, username } = req.body;
            const result: string = await repository.sendCongratulations(
                sprintCode as string,
                username as string
            );
            res.send(result);
            return;
        });

    return router;
};
