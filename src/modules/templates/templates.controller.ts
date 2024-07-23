import { Router } from "express";
import { Database } from "@/database";
import getRepositoryFunctions from "./templates.repository";

export default (db: Database) => {
    const router = Router();

    const repository = getRepositoryFunctions(db);

    router
        .route("/")

        .get(async (req, res) => {
            const result = await repository.getAllTemplates();
            res.send(result);
        })

        .post(async (req, res) => {
            const { message } = req.body;
            const result = await repository.addNewTemplate(message);
            res.status(201).send(result);
        })

        .patch(async (req, res) => {
            const id = parseInt(req.query.id as string, 10)

            const { newMessage } = req.body;

            const result = await repository.updateTemplateMessage(
                id,
                newMessage
            );
            res.send(result);
        })

        .delete(async (req, res) => {
            const id = parseInt(req.query.id as string, 10);
            const result = await repository.deleteTemplate(id);
            res.send(result);
        });

    return router;
};
