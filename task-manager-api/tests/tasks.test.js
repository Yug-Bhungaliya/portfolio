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

  test('AI description generation returns a fallback when no API key is configured', async () => {
    const previousKey = process.env.OPENAI_API_KEY;
    delete process.env.OPENAI_API_KEY;
    const token = jwt.sign({ id: '507f1f77bcf86cd799439011' }, process.env.JWT_SECRET);

    const response = await request(app)
      .post('/api/ai/generate-description')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Review pull request' });

    if (previousKey) process.env.OPENAI_API_KEY = previousKey;
    expect(response.statusCode).toBe(200);
    expect(response.body.fallback).toBe(true);
    expect(response.body.demo).toBe(true);
    expect(response.body.description).toContain('Review pull request');
    expect(response.body.message).toBe('Demo suggestion added. You can edit it before saving.');
  });
});
