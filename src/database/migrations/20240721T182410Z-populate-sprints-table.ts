import { DB } from "../types";
import { Kysely } from "kysely";

const codes = [
    "WD-1.1",
    "WD-1.2",
    "WD-1.3",
    "WD-1.4",
    "WD-2.1",
    "WD-2.2",
    "WD-2.3",
    "WD-2.4",
];

const titles = [
    "Loops",
    "Conditionals",
    "OOP",
    "Regular Expressions",
    "Promises",
    "Data Structures",
    "Algorithms",
    "Typing",
];

export async function up(db: Kysely<DB>) {
    await db.transaction().execute(async (trx) => {
        for (let i = 0; i < codes.length; i++) {
            await trx
                .insertInto("sprints")
                .values({
                    sprint_code: codes[i],
                    title: titles[i],
                })
                .execute();
        }
    });
}

export async function down(db: Kysely<DB>) {
    await db.transaction().execute(async (trx) => {
        await trx
            .deleteFrom("sprints")
            .where("sprint_code", "in", codes)
            .execute();
    });
}
