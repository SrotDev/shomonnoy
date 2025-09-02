import express from 'express';
import pg from 'pg';

const router = express.Router();
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL
});

// POST /api/road_requests
router.get('/test', (req, res) => {
  res.json({ message: '✅ Road request route is working!' });
});

router.post('/', async (req, res) => {
  try {
    const {
      name,
      company,
      reason,
      start_date,
      end_date,
      geometry // GeoJSON LineString from frontend
    } = req.body;

    const geomText = JSON.stringify(geometry);

    const query = `
      INSERT INTO road_requests
        (name, company, reason, start_date, end_date, geom)
      VALUES
        ($1, $2, $3, $4, $5, ST_SetSRID(ST_GeomFromGeoJSON($6), 4326))
      RETURNING id
    `;

    const values = [name, company, reason, start_date, end_date, geomText];
    const result = await pool.query(query, values);

    res.json({ ok: true, id: result.rows[0].id });
  } catch (err) {
    console.error('❌ Failed to insert road request:', err);
    res.status(500).json({ ok: false, error: 'Internal server error' });
  }
});

export default router;
