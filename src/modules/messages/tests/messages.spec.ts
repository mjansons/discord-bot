import supertest from 'supertest';
import createApp from '@/app';
import createTestDBwithMigrations from '../../../../tests/utils/createTestDatabase';
import { createFor } from '../../../../tests/utils/records';
import gipy from '@tests/utils/mockGiphy';
import discord from '@tests/utils/mockDiscord';

const db = await createTestDBwithMigrations();
const app = createApp(db, gipy, discord);

const createCompletedSprints = createFor(db, 'completed_sprints');
const createSentMessages = createFor(db, 'sent_messages');
const createSprints = createFor(db, 'sprints');
const createTemplates = createFor(db, 'templates');
const createUsers = createFor(db, 'users');

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

describe('GET /messages', () => {
  it('get a list of all congratulatory messages', async () => {
    const { body } = await supertest(app).get('/messages').expect(200);

    expect(body).toEqual([
      {
        id: 1,
        message: 'Yay, you did it!',
      },
      {
        id: 2,
        message: 'Congratulations!',
      },
    ]);
  });
});

describe('GET /messages?username=mjansons', () => {
  it('get a list of all congratulatory messages for a specific user', async () => {
    const { body } = await supertest(app)
      .get('/messages?username=mjansons')
      .expect(200);

    expect(body).toEqual([
      {
        id: 1,
        message: 'Yay, you did it!',
      },
      {
        id: 2,
        message: 'Congratulations!',
      },
    ]);
  });
});

describe('GET /messages?sprint=WD-1.1', () => {
  it('get a list of all congratulatory messages for a specific sprint', async () => {
    const { body } = await supertest(app)
      .get('/messages?sprint=WD-1.1')
      .expect(200);

    expect(body).toEqual([
      {
        id: 1,
        message: 'Yay, you did it!',
      },
    ]);
  });
});

describe('POST', () => {
  it('send a congratulatory message', async () => {
    const payload = {
      username: 'mjansons',
      sprintCode: 'WD-1.3',
    };

    const { body } = await supertest(app)
      .post('/messages')
      .send(payload)
      .set('Content-Type', 'application/json')
      .expect(201);

    expect(body).toEqual({ message: 'Message sent successfully' });
  });
});
