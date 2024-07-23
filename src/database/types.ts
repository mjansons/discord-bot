import type { ColumnType } from "kysely";

export type Generated<T> =
  T extends ColumnType<infer S, infer I, infer U>
    ? ColumnType<S, I | undefined, U>
    : ColumnType<T, T | undefined, T>;

export interface CompletedSprints {
  id: Generated<number>;
  sprint_id: number;
  user_id: number;
}

export interface SentMessages {
  created_at: Generated<string>;
  id: Generated<number>;
  sprint_id: number;
  template_id: number;
  user_id: number;
}

export interface Sprints {
  id: Generated<number>;
  sprint_code: string;
  title: string;
}

export interface Templates {
  id: Generated<number>;
  message: string;
}

export interface Users {
  id: Generated<number>;
  username: string;
}

export interface DB {
  completed_sprints: CompletedSprints;
  sent_messages: SentMessages;
  sprints: Sprints;
  templates: Templates;
  users: Users;
}
