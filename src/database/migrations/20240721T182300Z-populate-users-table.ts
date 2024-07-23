import { DB } from "../types";
import { Kysely } from "kysely";

const discordNames = ["@mjansons", "@random", "@user"];

export async function up(db: Kysely<DB>) {
    await db.transaction().execute(async (trx) => {
        for (let i = 0; i < discordNames.length; i++) {
            await trx
                .insertInto("users")
                .values({ username: discordNames[i] })
                .execute();
        }
    });
}

export async function down(db: Kysely<DB>) {
    await db.transaction().execute(async (trx) => {
        await trx
            .deleteFrom("users")
            .where("username", "in", discordNames)
            .execute();
    });
}
