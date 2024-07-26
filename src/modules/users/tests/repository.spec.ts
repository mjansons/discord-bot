import createTestDBwithMigrations from '../../../../tests/utils/createTestDatabase';
import { createFor } from '../../../../tests/utils/records';
import getRepositoryFunctions from '../users.repository';

const db = await createTestDBwithMigrations();
const createUsers = createFor(db, 'users');

const repository = getRepositoryFunctions(db);

beforeEach(async () => {
  await createUsers([{ id: 1, username: 'mjansons' }]);
});

afterEach(async () => {
  await db.deleteFrom('users').execute();
});

afterAll(async () => {
  db.destroy();
});

describe('getUserByUsername', async () => {
  it('should get User By Username', async () => {
    const result = await repository.getUserByUsername('mjansons');

    expect(result).toEqual({ id: 1, username: 'mjansons' });
  });
});

describe('addNewUser', async () => {
  it('should add New User', async () => {
    const result = await repository.addNewUser('turing-bot');

    expect(result).toEqual({ id: 2, username: 'turing-bot' });
  });
});
