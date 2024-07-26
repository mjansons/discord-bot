import { Kysely, SqliteDatabase, sql } from 'kysely';

export async function up(db: Kysely<SqliteDatabase>) {
  await db.schema
    .createTable('sent_messages')
    .addColumn('id', 'integer', (column) =>
      column.primaryKey().autoIncrement().notNull()
    )
    .addColumn('user_id', 'integer', (column) =>
      column.references('users.id').onDelete('cascade').notNull()
    )
    .addColumn('template_id', 'integer', (column) =>
      column.references('templates.id').onDelete('cascade').notNull()
    )
    .addColumn('sprint_id', 'integer', (column) =>
      column.references('sprints.id').onDelete('cascade').notNull()
    )
    .addColumn('created_at', 'datetime', (column) =>
      column.notNull().defaultTo(sql`CURRENT_TIMESTAMP`)
    )
    .execute();
}

export async function down(db: Kysely<SqliteDatabase>) {
  await db.schema.dropTable('sent_messages').execute();
}
