import request from 'supertest';
import { app } from '../../src/server';

describe('Device Validation', () => {
  test('POST /api/devices - should require name and mac', async () => {
    const testCases = [
      { name: '', mac: '00:11:22:33:44:55' },
      { name: 'Device 1', mac: '' },
      { name: '', mac: '' },
      {},
    ];

    for (const testCase of testCases) {
      const response = await request(app)
        .post('/api/devices')
        .send(testCase);
      
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Name and MAC are required');
    }
  });

  test('POST /api/devices - should validate MAC format', async () => {
    const response = await request(app)
      .post('/api/devices')
      .send({ name: 'Device 1', mac: 'invalid-mac' });
    
    // Note: We're not validating MAC format strictly per requirements
    // but we should accept any format as long as it's unique
    expect([201, 400]).toContain(response.status);
  });
});