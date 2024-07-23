import { type Database, Templates } from "@/database";
import type { Insertable, Selectable, Updateable } from "kysely";

type TemplateIdOptional = Insertable<Templates>;
type TemplateFieldsOptional = Updateable<Templates>;
type TemplateAllFields = Selectable<Templates>;

export default (db: Database) => ({
    getAllTemplates(): Promise<TemplateAllFields[] | undefined> {
        return db.selectFrom("templates").selectAll().execute();
    },

    addNewTemplate(message: string): Promise<TemplateAllFields | undefined> {
        db.insertInto("templates").values({ message: message }).execute();

        return db
            .selectFrom("templates")
            .selectAll()
            .where("message", "=", message)
            .executeTakeFirst();
    },

    updateTemplateMessage(
        id: number,
        message: string
    ): Promise<TemplateAllFields | undefined> {
        return db.transaction().execute(async (trx) => {
            await trx.updateTable("templates")
                .set({ message: message })
                .where("id", "=", id)
                .execute();

            return await trx
                .selectFrom("templates")
                .selectAll()
                .where("id", "=", id)
                .executeTakeFirst();
        });
    },

    deleteTemplate(id: number): Promise<TemplateAllFields | undefined> {
        return db.transaction().execute(async (trx) => {
            const deletable = await trx
                .selectFrom("templates")
                .selectAll()
                .where("id", "=", id)
                .executeTakeFirst();

            if (deletable) {
                await trx
                    .deleteFrom("templates")
                    .where("id", "=", id)
                    .execute();
                return deletable;
            }
            return undefined;
        });
    },
});
