process.env.JWT_SECRET = 'ci-test-secret';

jest.mock('../models/Task', () => ({
  find: jest.fn()
}));

const request = require('supertest');
const jwt = require('jsonwebtoken');
const Task = require('../models/Task');
const { app } = require('../server');

describe('Tasks API', () => {
  beforeEach(() => {
    Task.find.mockReturnValue({
      lean: jest.fn().mockResolvedValue([])
    });
  });

  test('GET /tasks returns 200 for an authenticated user', async () => {
    const token = jwt.sign({ id: '507f1f77bcf86cd799439011' }, process.env.JWT_SECRET);
    const response = await request(app)
      .get('/tasks')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([]);
  });
});
