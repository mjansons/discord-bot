import { Database, Templates } from '@/database';
import type { Selectable } from 'kysely';

type TemplateAllFields = Selectable<Templates>;

export default (db: Database) => ({
  getAllSentMessages(): Promise<TemplateAllFields[] | undefined> {
    return db
      .selectFrom('sent_messages')
      .innerJoin('templates', 'templates.id', 'template_id')
      .select(['templates.id', 'templates.message'])
      .execute();
  },

  getUserMessages(username: string): Promise<TemplateAllFields[] | undefined> {
    return db
      .selectFrom('sent_messages')
      .innerJoin('templates', 'templates.id', 'template_id')
      .innerJoin('users', 'sent_messages.user_id', 'users.id')
      .where('username', '=', username)
      .select(['templates.id', 'templates.message'])
      .execute();
  },

  getAllSprintMessages(
    sprintCode: string
  ): Promise<TemplateAllFields[] | undefined> {
    return db
      .selectFrom('sent_messages')
      .innerJoin('templates', 'templates.id', 'template_id')
      .innerJoin('sprints', 'sent_messages.sprint_id', 'sprints.id')
      .where('sprint_code', '=', sprintCode)
      .select(['templates.id', 'templates.message'])
      .execute();
  },

  addSentMessage(
    sprint_id: number,
    template_id: number,
    user_id: number
  ): Promise<
    { sprint_id: number; template_id: number; user_id: number } | undefined
  > {
    return db
      .insertInto('sent_messages')
      .values({
        sprint_id: sprint_id,
        template_id: template_id,
        user_id: user_id,
      })
      .returning(['sprint_id', 'template_id', 'user_id'])
      .executeTakeFirst();
  },
});
