import supertest from 'supertest';
import createApp from '@/app';
import createTestDBwithMigrations from '../../../../tests/utils/createTestDatabase';
import { createFor } from '../../../../tests/utils/records';
import gipy from '@tests/utils/mockGiphy';
import discord from '@tests/utils/mockDiscord';

const db = await createTestDBwithMigrations();
const app = createApp(db, gipy, discord);

const createSprints = createFor(db, 'sprints');

beforeEach(async () => {
  await createSprints([
    { id: 1, sprint_code: 'WD-1.1', title: 'Loops' },
    { id: 2, sprint_code: 'WD-1.2', title: 'Conditionals' },
    { id: 3, sprint_code: 'WD-1.3', title: 'Tests' },
  ]);
});

afterEach(async () => {
  await db.deleteFrom('sprints').execute();
});

afterAll(async () => {
  db.destroy();
});

describe('GET /sprints', () => {
  it('get a list of all sprints', async () => {
    const { body } = await supertest(app).get('/sprints').expect(200);

    expect(body).toEqual([
      { id: 1, sprintCode: 'WD-1.1', title: 'Loops' },
      { id: 2, sprintCode: 'WD-1.2', title: 'Conditionals' },
      { id: 3, sprintCode: 'WD-1.3', title: 'Tests' },
    ]);
  });

  it('get a 404, when there are nosprints', async () => {
    await db.deleteFrom('sprints').execute();
    const { body } = await supertest(app).get('/sprints').expect(404);

    expect(body).toEqual({
      error: {
        message: 'Resource Not Found',
        status: 404,
      },
    });
  });
});

describe('POST /sprints', () => {
  it('add a new sprint', async () => {
    const payload = {
      sprintCode: 'WD-1.4',
      title: 'A New Sprint',
    };

    const { body } = await supertest(app)
      .post('/sprints')
      .send(payload)
      .set('Content-Type', 'application/json')
      .expect(201);

    expect(body).toEqual({
      id: 4,
      sprintCode: 'WD-1.4',
      title: 'A New Sprint',
    });
  });

  it('gets 400, when sprint already exists', async () => {
    const payload = {
      sprintCode: 'WD-1.1',
      title: 'A New Sprint',
    };

    const { body } = await supertest(app)
      .post('/sprints')
      .send(payload)
      .set('Content-Type', 'application/json')
      .expect(400);

    expect(body).toEqual({
      error: {
        message: 'Please provide a unique Sprint Code',
        status: 400,
      },
    });
  });

  it('gets 400, when sprint title already exists', async () => {
    const payload = {
      sprintCode: 'WD-1.4',
      title: 'Loops',
    };

    const { body } = await supertest(app)
      .post('/sprints')
      .send(payload)
      .set('Content-Type', 'application/json')
      .expect(400);

    expect(body).toEqual({
      error: {
        message: 'Please provide a unique Sprint Title',
        status: 400,
      },
    });
  });
});

describe('PATCH /sprints?sprint=WD-1.3', () => {
  it('changes the sprint title', async () => {
    const payload = {
      newTitle: 'A New Sprint Title',
    };

    const { body } = await supertest(app)
      .patch('/sprints?sprint=WD-1.3')
      .send(payload)
      .set('Content-Type', 'application/json')
      .expect(200);

    expect(body).toEqual({
      id: 3,
      sprintCode: 'WD-1.3',
      title: 'A New Sprint Title',
    });
  });

  it('changes the sprint code', async () => {
    const payload = {
      newSprintCode: 'WD-2.1',
    };

    const { body } = await supertest(app)
      .patch('/sprints?sprint=WD-1.3')
      .send(payload)
      .set('Content-Type', 'application/json')
      .expect(200);
    console.log(body);

    expect(body).toEqual({
      id: 3,
      sprintCode: 'WD-2.1',
      title: 'Tests',
    });
  });

  it('changes gets 400 when title already exists', async () => {
    const payload = {
      newTitle: 'Loops',
    };

    const { body } = await supertest(app)
      .patch('/sprints?sprint=WD-1.2')
      .send(payload)
      .set('Content-Type', 'application/json')
      .expect(400);

    expect(body).toEqual({
      error: {
        message: 'Please provide a unique New Sprint Title',
        status: 400,
      },
    });
  });

  it('changes gets 400 when sprint code already exists', async () => {
    const payload = {
      newSprintCode: 'WD-1.1',
    };

    const { body } = await supertest(app)
      .patch('/sprints?sprint=WD-1.2')
      .send(payload)
      .set('Content-Type', 'application/json')
      .expect(400);

    expect(body).toEqual({
      error: {
        message: 'Please provide a unique New Sprint Code',
        status: 400,
      },
    });
  });
});

describe('DELETE /sprints?sprint=WD-1.3', () => {
  it('delete a sprint', async () => {
    const { body } = await supertest(app)
      .delete('/sprints?sprint=WD-1.1')
      .expect(200);

    expect(body).toEqual({ id: 1, sprintCode: 'WD-1.1', title: 'Loops' });
  });

  it('get 404 when sprint not found', async () => {
    const { body } = await supertest(app)
      .delete('/sprints?sprint=WD-1.9')
      .expect(404);

    expect(body).toEqual({
      error: {
        message: 'Sprint Not Found',
        status: 404,
      },
    });
  });

  it('get 400 when sprint code is invalid', async () => {
    await supertest(app).delete('/sprints?sprint=arfs').expect(400);
  });
});
