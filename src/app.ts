import express from "express";
import helmet from "helmet";
import messages from "./modules/messages/messages.controller";
import templates from "./modules/templates/templates.controller";
import sprints from "./modules/sprints/sprints.controller";
import { type Database } from "./database";

export default function createApp(db: Database) {
    const app = express();
    app.use(helmet());
    app.use(express.json());

    app.use("/messages", messages(db));
    app.use("/templates", templates(db));
    app.use("/sprints", sprints(db));

    return app;
}
