import { type Database, Templates } from '@/database';
import type { Selectable } from 'kysely';

type TemplateAllFields = Selectable<Templates>;

export default (db: Database) => ({
  getAllTemplates(): Promise<TemplateAllFields[]> {
    return db.selectFrom('templates').selectAll().execute();
  },

  getTemplateById(id: number): Promise<TemplateAllFields | undefined> {
    return db
      .selectFrom('templates')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst();
  },

  getTemplateByMessage(
    message: string
  ): Promise<TemplateAllFields | undefined> {
    return db
      .selectFrom('templates')
      .selectAll()
      .where('message', '=', message)
      .executeTakeFirst();
  },

  addNewTemplate(message: string): Promise<TemplateAllFields | undefined> {
    return db
      .insertInto('templates')
      .values({ message: message })
      .returningAll()
      .executeTakeFirst();
  },

  updateTemplateMessage(
    id: number,
    newMessage: string
  ): Promise<TemplateAllFields | undefined> {
    return db
      .updateTable('templates')
      .set({ message: newMessage })
      .where('id', '=', id)
      .returningAll()
      .executeTakeFirst();
  },

  deleteTemplate(id: number): Promise<TemplateAllFields | undefined> {
    return db
      .deleteFrom('templates')
      .where('id', '=', id)
      .returningAll()
      .executeTakeFirst();
  },
});
