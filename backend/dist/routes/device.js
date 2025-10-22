"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const database_1 = __importDefault(require("../database"));
const router = express_1.default.Router();
// GET /api/devices - List all devices
router.get('/', async (req, res) => {
    try {
        const [devices] = await database_1.default.execute('SELECT * FROM devices ORDER BY created_at DESC');
        res.json(devices);
    }
    catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Database error' });
    }
});
// POST /api/devices - Create device
router.post('/', async (req, res) => {
    const { name, mac } = req.body;
    // Validation
    if (!name || !mac) {
        return res.status(400).json({ error: 'Name and MAC are required' });
    }
    try {
        const [result] = await database_1.default.execute('INSERT INTO devices (name, mac) VALUES (?, ?)', [name, mac]);
        const [devices] = await database_1.default.execute('SELECT * FROM devices WHERE id = ?', [result.insertId]);
        const newDevice = devices[0];
        // Emit WebSocket event
        const io = req.app.get('io');
        io.emit('device:created', newDevice);
        res.status(201).json(newDevice);
    }
    catch (error) {
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
router.patch('/:id/status', async (req, res) => {
    const { id } = req.params;
    try {
        // Get current status
        const [devices] = await database_1.default.execute('SELECT * FROM devices WHERE id = ?', [id]);
        if (devices.length === 0) {
            return res.status(404).json({ error: 'Device not found' });
        }
        const currentDevice = devices[0];
        const newStatus = currentDevice.status === 'ATIVO' ? 'INATIVO' : 'ATIVO';
        // Update status
        await database_1.default.execute('UPDATE devices SET status = ? WHERE id = ?', [newStatus, id]);
        const [updatedDevices] = await database_1.default.execute('SELECT * FROM devices WHERE id = ?', [id]);
        const updatedDevice = updatedDevices[0];
        // Emit WebSocket event
        const io = req.app.get('io');
        io.emit('device:status', updatedDevice);
        res.json(updatedDevice);
    }
    catch (error) {
        console.error('Toggle status error:', error);
        res.status(500).json({ error: 'Database error' });
    }
});
exports.default = router;
//# sourceMappingURL=device.js.map