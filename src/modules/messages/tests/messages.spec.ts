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

  it('get 404 Not Found when there are no messages', async () => {
    await db.deleteFrom('sent_messages').execute();
    const { body } = await supertest(app).get('/messages').expect(404);

    expect(body).toEqual({
      error: {
        message: 'Resource Not Found',
        status: 404,
      },
    });
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

  it('get a 404, when there are no messages for a specific user', async () => {
    await db.deleteFrom('sent_messages').execute();
    const { body } = await supertest(app)
      .get('/messages?username=mjansons')
      .expect(404);

    expect(body).toEqual({
      error: {
        message: 'Resource Not Found',
        status: 404,
      },
    });
  });

  it('get a 404, when the user is not found in channel', async () => {
    await db.deleteFrom('sent_messages').execute();
    const { body } = await supertest(app)
      .get('/messages?username=random')
      .expect(404);

    expect(body).toEqual({
      error: {
        message: 'User Not Found',
        status: 404,
      },
    });
  });

  it('get a 404, when the user is not found in channel', async () => {
    await db.deleteFrom('sent_messages').execute();
    const { body } = await supertest(app)
      .get('/messages?username=random')
      .expect(404);

    expect(body).toEqual({
      error: {
        message: 'User Not Found',
        status: 404,
      },
    });
  });

  it('get a 400, when the username is not valid (more than 32 chars)', async () => {
    await db.deleteFrom('sent_messages').execute();
    await supertest(app)
      .get('/messages?username=esesesesesesesesesesesesesesesese')
      .expect(400);
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

  it('get 400 when sprint format is incorrect', async () => {
    await supertest(app).get('/messages?sprint=WD-').expect(400);
  });

  it('get 404 when sprint is not found', async () => {
    await supertest(app).get('/messages?sprint=WD-1.43').expect(404);
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

  it('gets 400 because message was already sent', async () => {
    const payload = {
      username: 'mjansons',
      sprintCode: 'WD-1.1',
    };

    const { body } = await supertest(app)
      .post('/messages')
      .send(payload)
      .set('Content-Type', 'application/json')
      .expect(400);

    expect(body).toEqual({
      error: {
        message: 'User has already finished the sprint',
        status: 400,
      },
    });
  });

  it('gets 404 because user was not found', async () => {
    const payload = {
      username: 'abc',
      sprintCode: 'WD-1.3',
    };

    await supertest(app)
      .post('/messages')
      .send(payload)
      .set('Content-Type', 'application/json')
      .expect(404);
  });

  it('gets 404 because sprint was not found', async () => {
    const payload = {
      username: 'mjansons',
      sprintCode: 'WD-9.2',
    };

    await supertest(app)
      .post('/messages')
      .send(payload)
      .set('Content-Type', 'application/json')
      .expect(404);
  });
});
