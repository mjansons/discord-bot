import createTestDBwithMigrations from '../../../../tests/utils/createTestDatabase';
import { createFor } from '../../../../tests/utils/records';
import getRepositoryFunctions from '../templates.repository';

const db = await createTestDBwithMigrations();
const createTemplates = createFor(db, 'templates');

const repository = getRepositoryFunctions(db);

beforeEach(async () => {
  await createTemplates([
    { id: 1, message: 'Yay, you did it!' },
    { id: 2, message: 'Congratulations!' },
  ]);
});

afterEach(async () => {
  await db.deleteFrom('templates').execute();
});

afterAll(async () => {
  db.destroy();
});

describe('getAllTemplates', async () => {
  it('should get all templates', async () => {
    const result = await repository.getAllTemplates();

    expect(result).toEqual([
      { id: 1, message: 'Yay, you did it!' },
      { id: 2, message: 'Congratulations!' },
    ]);
  });
});

describe('getTemplateById', async () => {
  it('should get template by ID', async () => {
    const result = await repository.getTemplateById(1);

    expect(result).toEqual({ id: 1, message: 'Yay, you did it!' });
  });
});

describe('getTemplateByMessage', async () => {
  it('should get template by message', async () => {
    const result = await repository.getTemplateByMessage('Yay, you did it!');

    expect(result).toEqual({ id: 1, message: 'Yay, you did it!' });
  });
});

describe('addNewTemplate', async () => {
  it('should add a new template', async () => {
    const result = await repository.addNewTemplate('Nice!');

    expect(result).toEqual({ id: 3, message: 'Nice!' });
  });
});

describe('updateTemplateMessage', async () => {
  it('should update Template Message', async () => {
    const result = await repository.updateTemplateMessage(1, 'Nice!');

    expect(result).toEqual({ id: 1, message: 'Nice!' });
  });
});

describe('deleteTemplate', async () => {
  it('should delete a Template by id', async () => {
    const result = await repository.deleteTemplate(1);

    expect(result).toEqual({ id: 1, message: 'Yay, you did it!' });
  });
});
