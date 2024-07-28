import supertest from 'supertest';
import createApp from '@/app';
import createTestDBwithMigrations from '../../../../tests/utils/createTestDatabase';
import { createFor } from '../../../../tests/utils/records';
import gipy from '@tests/utils/mockGiphy';
import discord from '@tests/utils/mockDiscord';

const db = await createTestDBwithMigrations();
const app = createApp(db, gipy, discord);

const createTemplates = createFor(db, 'templates');

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

describe('GET /templates', () => {
  it('get a list of all templates', async () => {
    const { body } = await supertest(app).get('/templates').expect(200);

    expect(body).toEqual([
      { id: 1, message: 'Yay, you did it!' },
      { id: 2, message: 'Congratulations!' },
    ]);
  });

  it('get 404 when there are no templates', async () => {
    await db.deleteFrom('templates').execute();

    const { body } = await supertest(app).get('/templates').expect(404);

    expect(body).toEqual({
      error: {
        message: 'Resource Not Found',
        status: 404,
      },
    });
  });
});

describe('POST /templates', () => {
  it('add a new template', async () => {
    const payload = {
      message: 'Yay3!',
    };

    const { body } = await supertest(app)
      .post('/templates')
      .send(payload)
      .set('Content-Type', 'application/json')
      .expect(201);

    expect(body).toEqual({ id: 3, message: 'Yay3!' });
  });

  it('returns 400 when the message has already been used', async () => {
    const payload = {
      message: 'Yay, you did it!',
    };

    const { body } = await supertest(app)
      .post('/templates')
      .send(payload)
      .set('Content-Type', 'application/json')
      .expect(400);

    expect(body).toEqual({
      error: {
        message: 'Please provide a unique message!',
        status: 400,
      },
    });
  });
});

describe('PATCH /templates', () => {
  it('edits an existing template title', async () => {
    const payload = {
      newMessage: 'Wowza!',
    };

    const { body } = await supertest(app)
      .patch('/templates?id=2')
      .send(payload)
      .set('Content-Type', 'application/json')
      .expect(200);

    expect(body).toEqual({ id: 2, message: 'Wowza!' });
  });
});

describe('DELETE /templates', () => {
  it('get a list of all templates', async () => {
    const { body } = await supertest(app).delete('/templates?id=2').expect(200);

    expect(body).toEqual({ id: 2, message: 'Congratulations!' });
  });
});
