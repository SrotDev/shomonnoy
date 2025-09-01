import express from 'express';
import cors from 'cors';
import pkg from 'pg';
const { Pool } = pkg;

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'shomonnoy',
  password: 'aaaaaa',
  port: 5432,
});

app.get('/api/roads', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, name, status, timeline, company, reason, ST_AsGeoJSON(geom)::json AS geometry FROM roads
    `);

    const geojson = {
      type: 'FeatureCollection',
      features: result.rows.map(row => ({
        type: 'Feature',
        geometry: row.geometry,
        properties: {
          id: row.id,
          name: row.name,
          status: row.status,
          timeline: row.timeline,
          company: row.company,
          reason: row.reason
        },
      })),
    };

    res.json(geojson);
  } catch (err) {
    console.error('❌ DB error:', err.message);
    res.status(500).send('Error fetching roads');
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
