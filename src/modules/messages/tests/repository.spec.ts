import createTestDBwithMigrations from '../../../../tests/utils/createTestDatabase';
import { createFor } from '../../../../tests/utils/records';
import getRepositoryFunctions from '../messages.repository';

const db = await createTestDBwithMigrations();
const createCompletedSprints = createFor(db, 'completed_sprints');
const createSentMessages = createFor(db, 'sent_messages');
const createSprints = createFor(db, 'sprints');
const createTemplates = createFor(db, 'templates');
const createUsers = createFor(db, 'users');

const repository = getRepositoryFunctions(db);

beforeEach(async () => {
  await createUsers([{ id: 1, username: 'mjansons' }]);
  await createTemplates([
    { id: 1, message: 'Yay, you did it!' },
    { id: 2, message: 'Congratulations!' },
  ]);
  await createSprints([
    { id: 1, sprint_code: 'WD-1.1', title: 'Loops' },
    { id: 2, sprint_code: 'WD-1.2', title: 'Conditionals' },
    { id: 3, sprint_code: 'WD-1.3', title: 'Tests' },
  ]);
  await createCompletedSprints([
    { id: 1, sprint_id: 1, user_id: 1 },
    { id: 2, sprint_id: 2, user_id: 1 },
  ]);
  await createSentMessages([
    {
      created_at: '2024-07-25 15:23:45',
      id: 1,
      sprint_id: 1,
      template_id: 1,
      user_id: 1,
    },
    {
      created_at: '2024-07-25 15:24:45',
      id: 2,
      sprint_id: 2,
      template_id: 2,
      user_id: 1,
    },
  ]);
});

afterEach(async () => {
  await db.deleteFrom('completed_sprints').execute();
  await db.deleteFrom('sent_messages').execute();
  await db.deleteFrom('sprints').execute();
  await db.deleteFrom('templates').execute();
  await db.deleteFrom('users').execute();
});

afterAll(async () => {
  db.destroy();
});

describe('getAllSentMessages', async () => {
  it('should return an array of all sent messages', async () => {
    const result = await repository.getAllSentMessages();

    expect(result).toEqual([
      { id: 1, message: 'Yay, you did it!' },
      { id: 2, message: 'Congratulations!' },
    ]);
  });
});

describe('getUserMessages', async () => {
  it('should return an array of all sent messages for a specific user', async () => {
    const result = await repository.getUserMessages('mjansons');

    expect(result).toEqual([
      { id: 1, message: 'Yay, you did it!' },
      { id: 2, message: 'Congratulations!' },
    ]);
  });
});

describe('getAllSprintMessages', async () => {
  it('should return an array of all sent messages for a specific sprint', async () => {
    const result = await repository.getAllSprintMessages('WD-1.1');

    expect(result).toEqual([{ id: 1, message: 'Yay, you did it!' }]);
  });
});

describe('addSentMessage', async () => {
  it('should create a new record in sent_messages', async () => {
    const result = await repository.addSentMessage(3, 1, 1);

    expect(result).toEqual({ sprintId: 3, templateId: 1, userId: 1 });
  });
});
