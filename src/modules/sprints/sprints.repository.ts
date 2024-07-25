import { type Database, Sprints } from "@/database";
import type { Insertable, Selectable, Updateable } from "kysely";

type SprintIdOptional = Insertable<Sprints>;
type SprintFieldsOptional = Updateable<Sprints>;
type SprintAllFields = Selectable<Sprints>;

export default (db: Database) => ({
    getAllSprints(): Promise<SprintAllFields[] | undefined> {
        return db.selectFrom("sprints").selectAll().execute();
    },

    getSprintBySprintCode(
        sprintCode: string
    ): Promise<SprintAllFields | undefined> {
        return db
            .selectFrom("sprints")
            .selectAll()
            .where("sprint_code", "=", sprintCode)
            .executeTakeFirst();
    },
    getSprintBySprintTitle(
        title: string
    ): Promise<SprintAllFields | undefined> {
        return db
            .selectFrom("sprints")
            .selectAll()
            .where("title", "=", title)
            .executeTakeFirst();
    },

    addNewSprint(
        sprintCode: string,
        title: string
    ): Promise<SprintAllFields | undefined> {
        db.insertInto("sprints")
            .values({ sprint_code: sprintCode, title: title })
            .execute();

        return db
            .selectFrom("sprints")
            .selectAll()
            .where("sprint_code", "=", sprintCode)
            .where("title", "=", title)
            .executeTakeFirst();
    },

    updateSprintCode(
        sprintCode: string,
        newSprintCode: string
    ): Promise<SprintAllFields | undefined> {
        db.updateTable("sprints")
            .set({ sprint_code: newSprintCode })
            .where("sprint_code", "=", sprintCode)
            .execute();

        return db
            .selectFrom("sprints")
            .selectAll()
            .where("sprint_code", "=", newSprintCode)
            .executeTakeFirst();
    },

    updateSprintTitle(
        sprintCode: string,
        newSprintTitle: string
    ): Promise<SprintAllFields | undefined> {
        db.updateTable("sprints")
            .set({ title: newSprintTitle })
            .where("sprint_code", "=", sprintCode)
            .execute();

        return db
            .selectFrom("sprints")
            .selectAll()
            .where("sprint_code", "=", sprintCode)
            .executeTakeFirst();
    },

    deleteSprint(sprintCode: string): Promise<SprintAllFields | undefined> {
        return db.transaction().execute(async (trx) => {
            const deletable = await trx
                .selectFrom("sprints")
                .selectAll()
                .where("sprint_code", "=", sprintCode)
                .executeTakeFirst();

            if (deletable) {
                await trx
                    .deleteFrom("sprints")
                    .where("sprint_code", "=", sprintCode)
                    .execute();
                return deletable;
            }
            return undefined;
        });
    },

    getCompletedSprint(
        sprintCode: string,
        username: string
    ): Promise<SprintAllFields | undefined> {
        return db
            .selectFrom("completed_sprints")
            .innerJoin("sprints", "completed_sprints.sprint_id", "sprints.id")
            .innerJoin("users", "completed_sprints.user_id", "users.id")
            .select(["sprints.id", "sprints.sprint_code", "sprints.title"])
            .where("sprint_code", "=", sprintCode)
            .where("username", "=", username)
            .executeTakeFirst();
    },

    updateCompletedSprint(
        sprint_id: number,
        user_id: number
    ): Promise<{ id: number; sprint_id: number; user_id: number } | undefined> {
        return db
            .insertInto("completed_sprints")
            .values({ sprint_id: sprint_id, user_id: user_id })
            .returning(["id", "sprint_id", "user_id"])
            .executeTakeFirst();
    },
});
