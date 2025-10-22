import request from 'supertest';
import { createApp } from '../src/app';
import db from '../src/database';
import { ResultSetHeader } from 'mysql2';

describe('Devices API', () => {
  let app: Express.Application;
  let httpServer: any;
  let io: any;

  beforeAll(async () => {
    // Create app instance for testing
    const { app: testApp, httpServer: testServer, io: testIo } = createApp();
    app = testApp;
    httpServer = testServer;
    io = testIo;
  });

  beforeEach(async () => {
    await db.execute('DELETE FROM devices');
  });

  afterAll(async () => {
    // Close connections
    if (io) {
      io.close();
    }
    if (httpServer) {
      httpServer.close();
    }
    await db.end();
  });

  test('POST /api/devices - should create device', async () => {
    const response = await request(app)
      .post('/api/devices')
      .send({ name: 'Device 1', mac: '00:11:22:33:44:55' });
    
    expect(response.status).toBe(201);
    expect(response.body.name).toBe('Device 1');
    expect(response.body.mac).toBe('00:11:22:33:44:55');
    expect(response.body.status).toBe('ATIVO');
  });

  test('POST /api/devices - should reject duplicate MAC', async () => {
    // First device
    await request(app)
      .post('/api/devices')
      .send({ name: 'Device 1', mac: '00:11:22:33:44:55' });

    // Try to create device with same MAC
    const response = await request(app)
      .post('/api/devices')
      .send({ name: 'Device 2', mac: '00:11:22:33:44:55' });
    
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('MAC address already exists');
  });

  test('POST /api/devices - should reject missing name or mac', async () => {
    const testCases = [
      { mac: '00:11:22:33:44:55' }, // missing name
      { name: 'Device 1' }, // missing mac
      {} // missing both
    ];

    for (const body of testCases) {
      const response = await request(app)
        .post('/api/devices')
        .send(body);
      
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Name and MAC are required');
    }
  });

  test('GET /api/devices - should list devices', async () => {
    // Create a device first
    await request(app)
      .post('/api/devices')
      .send({ name: 'Device 1', mac: '00:11:22:33:44:55' });

    const response = await request(app).get('/api/devices');
    
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(1);
    expect(response.body[0].name).toBe('Device 1');
    expect(response.body[0].mac).toBe('00:11:22:33:44:55');
  });

  test('GET /api/devices - should return empty array when no devices', async () => {
    const response = await request(app).get('/api/devices');
    
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(0);
  });

  test('PATCH /api/devices/:id/status - should toggle status from ATIVO to INATIVO', async () => {
    // Create a device
    const createResponse = await request(app)
      .post('/api/devices')
      .send({ name: 'Device 1', mac: '00:11:22:33:44:55' });

    const deviceId = createResponse.body.id;

    const response = await request(app)
      .patch(`/api/devices/${deviceId}/status`);
    
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('INATIVO');
    expect(response.body.id).toBe(deviceId);
  });

  test('PATCH /api/devices/:id/status - should toggle status from INATIVO to ATIVO', async () => {
    // Create a device and set it to INATIVO first
    const createResponse = await request(app)
      .post('/api/devices')
      .send({ name: 'Device 1', mac: '00:11:22:33:44:56' });

    const deviceId = createResponse.body.id;

    // First toggle to INATIVO
    await request(app).patch(`/api/devices/${deviceId}/status`);

    // Then toggle back to ATIVO
    const response = await request(app)
      .patch(`/api/devices/${deviceId}/status`);
    
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ATIVO');
    expect(response.body.id).toBe(deviceId);
  });

  test('PATCH /api/devices/:id/status - should return 404 for non-existent device', async () => {
    const response = await request(app)
      .patch('/api/devices/999/status');
    
    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Device not found');
  });
});