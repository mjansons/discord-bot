import { Kysely, SqliteDatabase } from "kysely";

export async function up(db: Kysely<SqliteDatabase>) {
    await db.schema
        .createTable("sprints")
        .addColumn("id", "integer", (column) =>
            column.primaryKey().autoIncrement().notNull()
        )
        .addColumn("sprint_code", "text", (column) => column.notNull().unique())
        .addColumn("title", "text", (column) => column.notNull().unique())
        .execute();
}

export async function down(db: Kysely<SqliteDatabase>) {
    await db.schema.dropTable("sprints").execute();
}
