import { DB } from "../types";
import { Kysely } from "kysely";

export async function up(db: Kysely<DB>) {
    await db
        .insertInto("sent_messages")
        .values({ sprint_id: 1, template_id: 1, user_id: 1 })
        .execute();
}

export async function down(db: Kysely<DB>) {
    await db
        .deleteFrom("sent_messages")
        .where("sprint_id", "=", 1)
        .where("user_id", "=", 1)
        .execute();
}
