import { Kysely, SqliteDatabase } from 'kysely';

export async function up(db: Kysely<SqliteDatabase>) {
  await db.schema
    .createTable('completed_sprints')
    .addColumn('id', 'integer', (column) =>
      column.primaryKey().autoIncrement().notNull()
    )
    .addColumn('user_id', 'integer', (column) =>
      column.references('users.id').onDelete('cascade').notNull()
    )
    .addColumn('sprint_id', 'integer', (column) =>
      column.references('sprints.id').onDelete('cascade').notNull()
    )
    .execute();
}

export async function down(db: Kysely<SqliteDatabase>) {
  await db.schema.dropTable('completed_sprints').execute();
}
