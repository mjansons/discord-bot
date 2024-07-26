import createTestDBwithMigrations from '../../../../tests/utils/createTestDatabase';
import { createFor } from '../../../../tests/utils/records';
import getRepositoryFunctions from '../sprints.repository';

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

describe('getAllSprints', async () => {
  it('should return an array of all sent sprints', async () => {
    const result = await repository.getAllSprints();

    expect(result).toEqual([
      { id: 1, sprintCode: 'WD-1.1', title: 'Loops' },
      { id: 2, sprintCode: 'WD-1.2', title: 'Conditionals' },
      { id: 3, sprintCode: 'WD-1.3', title: 'Tests' },
    ]);
  });
});

describe('getSprintBySprintCode', async () => {
  it('should return sprint by sprint code', async () => {
    const result = await repository.getSprintBySprintCode('WD-1.1');

    expect(result).toEqual({ id: 1, sprintCode: 'WD-1.1', title: 'Loops' });
  });
});

describe('getSprintBySprintTitle', async () => {
  it('should return sprint by title', async () => {
    const result = await repository.getSprintBySprintTitle('Loops');

    expect(result).toEqual({ id: 1, sprintCode: 'WD-1.1', title: 'Loops' });
  });
});

describe('addNewSprint', async () => {
  it('should create a new record in sprints', async () => {
    const result = await repository.addNewSprint('WD-2.2', 'Recursion');

    expect(result).toEqual({
      id: 4,
      sprintCode: 'WD-2.2',
      title: 'Recursion',
    });
  });
});

describe('updateSprintCode', async () => {
  it('should update sprint code', async () => {
    const result = await repository.updateSprintCode('WD-1.1', 'WD-2.1');

    expect(result).toEqual({ id: 1, sprintCode: 'WD-2.1', title: 'Loops' });
  });
});

describe('updateSprintTitle', async () => {
  it('should update sprint title', async () => {
    const result = await repository.updateSprintTitle('WD-1.1', 'New Title!');

    expect(result).toEqual({
      id: 1,
      sprintCode: 'WD-1.1',
      title: 'New Title!',
    });
  });
});

describe('deleteSprint', async () => {
  it('should update delete sprint', async () => {
    const result = await repository.deleteSprint('WD-1.1');

    expect(result).toEqual({ id: 1, sprintCode: 'WD-1.1', title: 'Loops' });
  });
});

describe('getCompletedSprint', async () => {
  it('should get a Completed Sprint by sprint code and username', async () => {
    const result = await repository.getCompletedSprint('WD-1.1', 'mjansons');

    expect(result).toEqual({ id: 1, sprintCode: 'WD-1.1', title: 'Loops' });
  });
});

describe('updateCompletedSprint', async () => {
  it('should update Completed Sprint by sprint id and user id', async () => {
    const result = await repository.updateCompletedSprint(3, 1);

    expect(result).toEqual({ id: 3, sprintId: 3, userId: 1 });
  });
});
