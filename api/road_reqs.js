import express from 'express';
import { pool } from '../server.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    console.log("🔵 Request received to /api/road_requests");
    console.log("🟢 Body:", req.body);

    const { name, status, timeline, company, reason, geometry } = req.body;

    const result = await pool.query(
      `INSERT INTO roads (name, status, timeline, company, reason, geom)
       VALUES ($1, $2, $3, $4, $5, ST_GeomFromGeoJSON($6)) RETURNING *`,
      [name, status, timeline, company, reason, JSON.stringify(geometry)]
    );

    console.log("✅ Insert successful:", result.rows[0]);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("❌ Error inserting road:", err.message);
    res.status(500).json({ error: err.message });
  }
});

router.post('/test', (req, res) => {
  console.log("📥 Received test JSON:", req.body);
  res.json({ received: req.body });
});


export default router;
