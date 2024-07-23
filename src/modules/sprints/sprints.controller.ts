import { Router } from "express";
import { Database } from "@/database";
import getRepositoryFunctions from "./sprints.repository";

export default (db: Database) => {
    const router = Router();

    const repository = getRepositoryFunctions(db);

    router
        .route("/")

        .get(async (req, res) => {
            const result = await repository.getAllSprints();
            res.send(result);
        })

        .post(async (req, res) => {
            const { sprintCode, title } = req.body;
            const result = await repository.addNewSprint(sprintCode, title);
            res.status(201).send(result);
        })

        .patch(async (req, res) => {
            const { sprint } = req.query;
            const { newSprintCode, title } = req.body;

            if (newSprintCode) {
                const result = await repository.updateSprintCode(
                    sprint as string,
                    newSprintCode
                );
                res.send(result);
            }

            if (title) {
                const result = await repository.updateSprintTitle(
                    sprint as string,
                    title
                );
                res.send(result);
            }
        })

        .delete(async (req, res) => {
            const { sprint } = req.query;
            const result = await repository.deleteSprint(sprint as string);
            res.send(result);
        });

    return router;
};
