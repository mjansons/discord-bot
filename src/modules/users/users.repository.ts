import { type Database, Users } from '@/database';
import type { Selectable } from 'kysely';

type UserAllFields = Selectable<Users>;

export default (db: Database) => ({
  getUserByUsername(username: string): Promise<UserAllFields | undefined> {
    return db
      .selectFrom('users')
      .selectAll()
      .where('username', '=', username)
      .executeTakeFirst();
  },

  addNewUser(username: string): Promise<UserAllFields | undefined> {
    return db
      .insertInto('users')
      .values({ username: username })
      .returning(['id', 'username'])
      .executeTakeFirst();
  },

  // getAllUsers(): Promise<UserAllFields[] | undefined> {
  //     return db.selectFrom("users").selectAll().execute();
  // },

  // getUserById(id: number): Promise<UserAllFields | undefined> {
  //     return db
  //         .selectFrom("users")
  //         .selectAll()
  //         .where("id", "=", id)
  //         .executeTakeFirst();
  // },

  // updateUsername(
  //     id: number,
  //     username: string
  // ): Promise<UserAllFields | undefined> {
  //     return db
  //         .updateTable("users")
  //         .set({ username: username })
  //         .where("id", "=", id)
  //         .returningAll()
  //         .executeTakeFirst();
  // },

  // deleteUser(id: number): Promise<UserAllFields | undefined> {
  //     return db
  //         .deleteFrom("users")
  //         .where("id", "=", id)
  //         .returningAll()
  //         .executeTakeFirst();
  // },
});
