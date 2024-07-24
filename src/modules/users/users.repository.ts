import { type Database, Users } from "@/database";
import type { Insertable, Selectable, Updateable } from "kysely";

type UserIdOptional = Insertable<Users>;
type UserFieldsOptional = Updateable<Users>;
type UserAllFields = Selectable<Users>;

export default (db: Database) => ({
    getAllTemplates(): Promise<UserAllFields[] | undefined> {
        return db.selectFrom("users").selectAll().execute();
    },

    getUserById(id: number): Promise<UserAllFields | undefined> {
        return db
            .selectFrom("users")
            .selectAll()
            .where("id", "=", id)
            .executeTakeFirst();
    },

    getUserByUsername(
        username: string
    ): Promise<UserAllFields | undefined> {
        return db
            .selectFrom("users")
            .selectAll()
            .where("username", "=", username)
            .executeTakeFirst();
    },

    addNewUser(username: string): Promise<UserAllFields | undefined> {
        db.insertInto("users").values({ username: username }).execute();

        return db
            .selectFrom("users")
            .selectAll()
            .where("username", "=", username)
            .executeTakeFirst();
    },

    updateUsername(
        id: number,
        username: string
    ): Promise<UserAllFields | undefined> {
        return db.transaction().execute(async (trx) => {
            await trx
                .updateTable("users")
                .set({ username: username })
                .where("id", "=", id)
                .execute();

            return await trx
                .selectFrom("users")
                .selectAll()
                .where("id", "=", id)
                .executeTakeFirst();
        });
    },

    deleteUser(id: number): Promise<UserAllFields | undefined> {
        return db.transaction().execute(async (trx) => {
            const deletable = await trx
                .selectFrom("users")
                .selectAll()
                .where("id", "=", id)
                .executeTakeFirst();

            if (deletable) {
                await trx
                    .deleteFrom("users")
                    .where("id", "=", id)
                    .execute();
                return deletable;
            }
            return undefined;
        });
    },
});
