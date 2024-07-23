import { Database, Templates } from "@/database";
import type { Insertable, Selectable, Updateable } from "kysely";

type TemplateIdOptional = Insertable<Templates>;
type TemplateFieldsOptional = Updateable<Templates>;
type TemplateAllFields = Selectable<Templates>;

export default (db: Database) => ({
    getAllSentMessages(): Promise<TemplateAllFields[] | undefined> {
        return db
        .selectFrom("sent_messages")
        .innerJoin("templates", "templates.id", "template_id")
        .select(["templates.id", "templates.message"])
        .execute();
    },
    getUserMessages(
        username: string
    ): Promise<TemplateAllFields[] | undefined> {
        return db
            .selectFrom("sent_messages")
            .innerJoin("templates", "templates.id", "template_id")
            .innerJoin("users", "sent_messages.user_id", "users.id")
            .where("username", "=", username)
            .select(["templates.id", "templates.message"])
            .execute();
    },
    getAllSprintMessages(
        sprintCode: string
    ): Promise<TemplateAllFields[] | undefined> {
        return db
            .selectFrom("sent_messages")
            .innerJoin("templates", "templates.id", "template_id")
            .innerJoin("sprints", "sent_messages.sprint_id", "sprints.id")
            .where("sprint_code", "=", sprintCode)
            .select(["templates.id", "templates.message"])
            .execute();
    },
    sendCongratulations(sprintCode: string, username: string) {
        // TO DO - send a congratulatory message to a user on Discord
        return `congrats sent using ${sprintCode} and ${username} stuff`;
    },
});
