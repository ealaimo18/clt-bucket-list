import { Router } from 'express';
import { getDb } from '../db/schema.js';

const router = Router();

// ── GET /activity ─────────────────────────────────────────────────────────
// Recent activity — used for partner notifications
router.get('/', (req, res) => {
  const db = getDb();
  const { limit = 20, since } = req.query;

  let query = `
    SELECT al.*, i.name as item_name, i.category, i.neighborhood
    FROM activity_log al
    LEFT JOIN items i ON i.id = al.item_id
    WHERE 1=1
  `;
  const params = [];

  if (since) {
    query += ' AND al.created_at > ?';
    params.push(since);
  }

  query += ' ORDER BY al.created_at DESC LIMIT ?';
  params.push(parseInt(limit));

  const logs = db.prepare(query).all(...params);
  res.json({ activity: logs });
});

export default router;
