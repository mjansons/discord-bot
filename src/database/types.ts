import type { ColumnType } from "kysely";

export type Generated<T> =
  T extends ColumnType<infer S, infer I, infer U>
    ? ColumnType<S, I | undefined, U>
    : ColumnType<T, T | undefined, T>;

export interface CompletedSprints {
  id: Generated<number>;
  sprintId: string;
  userId: string;
}

export interface SentMessages {
  createdAt: Generated<string>;
  id: Generated<number>;
  sprintId: string;
  templateId: string;
  userId: string;
}

export interface Sprints {
  id: Generated<number>;
  sprintCode: string;
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
  completedSprints: CompletedSprints;
  sentMessages: SentMessages;
  sprints: Sprints;
  templates: Templates;
  users: Users;
}
