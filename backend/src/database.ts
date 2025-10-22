import mysql from 'mysql2';

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'devices_db',
  waitForConnections: true,
  connectionLimit: 100,
  queueLimit: 0
});

export default pool.promise();