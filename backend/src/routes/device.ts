import express from 'express';
import db from '../database';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { Device, CreateDeviceRequest } from '../types/device';

const router = express.Router();

// GET /api/devices - List all devices
router.get('/', async (req: express.Request, res: express.Response) => {
  try {
    const [devices] = await db.execute<RowDataPacket[]>(
      'SELECT * FROM devices ORDER BY created_at DESC'
    );
    res.json(devices as Device[]);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// POST /api/devices - Create device
router.post('/', async (req: express.Request, res: express.Response) => {
  const { name, mac }: CreateDeviceRequest = req.body;

  // Validation
  if (!name || !mac) {
    return res.status(400).json({ error: 'Name and MAC are required' });
  }

  try {
    const [result] = await db.execute<ResultSetHeader>(
      'INSERT INTO devices (name, mac) VALUES (?, ?)',
      [name, mac]
    );

    const [devices] = await db.execute<RowDataPacket[]>(
      'SELECT * FROM devices WHERE id = ?',
      [result.insertId]
    );

    const newDevice = devices[0] as Device;

    // Emit WebSocket event
    const io = req.app.get('io');
    io.emit('device:created', newDevice);

    res.status(201).json(newDevice);
} catch (error: any) {
  if (error.code === 'ER_DUP_ENTRY') {
    return res.status(400).json({ error: 'MAC address already exists' });
  }
  // Only log unexpected errors, not expected ones like duplicate MAC
  if (error.code !== 'ER_DUP_ENTRY') {
    console.error('Create device error:', error);
  }
  res.status(500).json({ error: 'Database error' });
}
});

// PATCH /api/devices/:id/status - Toggle status
router.patch('/:id/status', async (req: express.Request, res: express.Response) => {
  const { id } = req.params;

  try {
    // Get current status
    const [devices] = await db.execute<RowDataPacket[]>(
      'SELECT * FROM devices WHERE id = ?',
      [id]
    );

    if (devices.length === 0) {
      return res.status(404).json({ error: 'Device not found' });
    }

    const currentDevice = devices[0] as Device;
    const newStatus = currentDevice.status === 'ATIVO' ? 'INATIVO' : 'ATIVO';

    // Update status
    await db.execute(
      'UPDATE devices SET status = ? WHERE id = ?',
      [newStatus, id]
    );

    const [updatedDevices] = await db.execute<RowDataPacket[]>(
      'SELECT * FROM devices WHERE id = ?',
      [id]
    );

    const updatedDevice = updatedDevices[0] as Device;

    // Emit WebSocket event
    const io = req.app.get('io');
    io.emit('device:status', updatedDevice);

    res.json(updatedDevice);
  } catch (error) {
    console.error('Toggle status error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

export default router;