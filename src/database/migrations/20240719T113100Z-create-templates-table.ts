import { Kysely, SqliteDatabase } from "kysely";

export async function up(db: Kysely<SqliteDatabase>) {
    await db.schema
        .createTable("templates")
        .addColumn("id", "integer", (column) =>
            column.primaryKey().autoIncrement().notNull()
        )
        .addColumn("message", "text", (column) => column.notNull().unique())
        .execute();
}

export async function down(db: Kysely<SqliteDatabase>) {
    await db.schema.dropTable("templates").execute();
}
