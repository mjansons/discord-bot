import { DB } from "../types";
import { Kysely } from "kysely";

const phrases = [
    `Nice work! Everything is possible when you just believe in yourself!`,
    "Always knew you had it in you! Great job!",
    "This calls for celebrating! Congratulations!",
    "Warmest applause on your achievement. You rock!",
    "Nice work! Everything is possible when you just believe in yourself!",
    "Applause, applause, applause! Congrats on your hard-earned success!",
    "You did it! We are so proud of you!",
    "You have worked so hard for this. Congrats!",
    "Well done! Enjoy what you do and success will follow.",
    "Applause on your well-deserved success.",
    "How does it feel to make it to the top?",
    "BRAVO, BRAVO, BRAVO!! Congratulations!",
    "Whoop! You are doing great!!",
];

export async function up(db: Kysely<DB>) {
    await db.transaction().execute(async (trx) => {
        for (let i = 0; i < phrases.length; i++) {
            await trx
                .insertInto("templates")
                .values({ message: phrases[i] })
                .execute();
        }
    });
}

export async function down(db: Kysely<DB>) {
    await db.transaction().execute(async (trx) => {
        await trx
            .deleteFrom("templates")
            .where("message", "in", phrases)
            .execute();
    });
}
