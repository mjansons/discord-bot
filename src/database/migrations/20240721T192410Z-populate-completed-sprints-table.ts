import { DB } from "../types";
import { Kysely } from "kysely";

export async function up(db: Kysely<DB>) {
    await db
        .insertInto("completed_sprints")
        .values({ sprint_id: 1, user_id: 1 })
        .execute();
}

export async function down(db: Kysely<DB>) {
    await db
        .deleteFrom("completed_sprints")
        .where("sprint_id", "=", 1)
        .where("user_id", "=", 1)
        .execute();
}
