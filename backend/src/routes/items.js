import { Router } from 'express';
import { getDb } from '../db/schema.js';

const router = Router();

// ── GET /items ──────────────────────────────────────────────────────────
// Query params: category, visited, neighborhood, time_of_day, search
router.get('/', (req, res) => {
  const db = getDb();
  const { category, visited, neighborhood, time_of_day, search } = req.query;

  let query = 'SELECT * FROM items WHERE 1=1';
  const params = [];

  if (category) {
    query += ' AND category = ?';
    params.push(category);
  }
  if (visited !== undefined) {
    query += ' AND visited = ?';
    params.push(visited === 'true' ? 1 : 0);
  }
  if (neighborhood) {
    query += ' AND neighborhood = ?';
    params.push(neighborhood);
  }
  if (time_of_day) {
    query += ' AND (time_of_day = ? OR time_of_day = "any")';
    params.push(time_of_day);
  }
  if (search) {
    query += ' AND (name LIKE ? OR description LIKE ? OR neighborhood LIKE ?)';
    const term = `%${search}%`;
    params.push(term, term, term);
  }

  query += ' ORDER BY category, name';

  const items = db.prepare(query).all(...params);
  res.json({ items, total: items.length });
});

// ── GET /items/categories ───────────────────────────────────────────────
router.get('/categories', (req, res) => {
  const db = getDb();
  const rows = db.prepare(`
    SELECT
      category,
      COUNT(*) as total,
      SUM(visited) as visited_count
    FROM items
    GROUP BY category
    ORDER BY category
  `).all();
  res.json({ categories: rows });
});

// ── GET /items/neighborhoods ────────────────────────────────────────────
router.get('/neighborhoods', (req, res) => {
  const db = getDb();
  const rows = db.prepare(`
    SELECT neighborhood, COUNT(*) as count
    FROM items
    WHERE lat IS NOT NULL
    GROUP BY neighborhood
    ORDER BY count DESC
  `).all();
  res.json({ neighborhoods: rows });
});

// ── GET /items/nearby ───────────────────────────────────────────────────
// ?lat=35.2&lng=-80.8&radius=2 (radius in km, default 2km)
router.get('/nearby', (req, res) => {
  const { lat, lng, radius = 2, exclude_id } = req.query;
  if (!lat || !lng) return res.status(400).json({ error: 'lat and lng required' });

  const db = getDb();
  // Haversine approximation — good enough for small distances
  const items = db.prepare(`
    SELECT *,
      (6371 * acos(
        cos(radians(?)) * cos(radians(lat)) *
        cos(radians(lng) - radians(?)) +
        sin(radians(?)) * sin(radians(lat))
      )) AS distance_km
    FROM items
    WHERE lat IS NOT NULL
      AND visited = 0
      AND id != COALESCE(?, -1)
    HAVING distance_km < ?
    ORDER BY distance_km
    LIMIT 10
  `).all(lat, lng, lat, exclude_id || null, radius);

  res.json({ items, center: { lat: parseFloat(lat), lng: parseFloat(lng) } });
});

// ── GET /items/:id ──────────────────────────────────────────────────────
router.get('/:id', (req, res) => {
  const db = getDb();
  const item = db.prepare('SELECT * FROM items WHERE id = ?').get(req.params.id);
  if (!item) return res.status(404).json({ error: 'Item not found' });
  res.json({ item });
});

// ── POST /items ─────────────────────────────────────────────────────────
router.post('/', (req, res) => {
  const db = getDb();
  const {
    name, category, subcategory, description,
    address, neighborhood, lat, lng, drive_time,
    time_of_day, day_of_week, recurrence, event_date,
    ticket_required, remind_days_before,
    external_url, ticket_url, source,
  } = req.body;

  if (!name || !category) {
    return res.status(400).json({ error: 'name and category are required' });
  }

  const result = db.prepare(`
    INSERT INTO items (
      name, category, subcategory, description,
      address, neighborhood, lat, lng, drive_time,
      time_of_day, day_of_week, recurrence, event_date,
      ticket_required, remind_days_before,
      external_url, ticket_url, source
    ) VALUES (
      @name, @category, @subcategory, @description,
      @address, @neighborhood, @lat, @lng, @drive_time,
      @time_of_day, @day_of_week, @recurrence, @event_date,
      @ticket_required, @remind_days_before,
      @external_url, @ticket_url, @source
    )
  `).run({
    name, category,
    subcategory: subcategory || null,
    description: description || null,
    address: address || null,
    neighborhood: neighborhood || null,
    lat: lat || null,
    lng: lng || null,
    drive_time: drive_time || null,
    time_of_day: time_of_day || 'any',
    day_of_week: day_of_week || null,
    recurrence: recurrence || null,
    event_date: event_date || null,
    ticket_required: ticket_required ? 1 : 0,
    remind_days_before: remind_days_before || 0,
    external_url: external_url || null,
    ticket_url: ticket_url || null,
    source: source || 'manual',
  });

  const item = db.prepare('SELECT * FROM items WHERE id = ?').get(result.lastInsertRowid);

  // Log activity
  db.prepare(`
    INSERT INTO activity_log (item_id, action, actor)
    VALUES (?, 'added', ?)
  `).run(result.lastInsertRowid, req.actor || 'manue');

  res.status(201).json({ item });
});

// ── PATCH /items/:id ─────────────────────────────────────────────────────
router.patch('/:id', (req, res) => {
  const db = getDb();
  const item = db.prepare('SELECT * FROM items WHERE id = ?').get(req.params.id);
  if (!item) return res.status(404).json({ error: 'Item not found' });

  const allowed = [
    'name', 'category', 'subcategory', 'description',
    'address', 'neighborhood', 'lat', 'lng', 'drive_time',
    'time_of_day', 'day_of_week', 'recurrence', 'event_date',
    'ticket_required', 'remind_days_before',
    'external_url', 'ticket_url',
  ];

  const updates = Object.fromEntries(
    Object.entries(req.body).filter(([k]) => allowed.includes(k))
  );

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: 'No valid fields to update' });
  }

  const setClause = Object.keys(updates).map(k => `${k} = @${k}`).join(', ');
  db.prepare(`UPDATE items SET ${setClause}, updated_at = datetime('now') WHERE id = @id`)
    .run({ ...updates, id: req.params.id });

  const updated = db.prepare('SELECT * FROM items WHERE id = ?').get(req.params.id);
  res.json({ item: updated });
});

// ── PATCH /items/:id/visited ─────────────────────────────────────────────
// Toggle visited state — main way to check off items
router.patch('/:id/visited', (req, res) => {
  const db = getDb();
  const item = db.prepare('SELECT * FROM items WHERE id = ?').get(req.params.id);
  if (!item) return res.status(404).json({ error: 'Item not found' });

  const actor = req.body.actor || 'manue'; // 'manue' or 'partner'
  const newVisited = !item.visited;
  const newVisitedBy = newVisited ? actor : null;

  db.prepare(`
    UPDATE items
    SET visited = ?, visited_by = ?, visited_at = ?,  updated_at = datetime('now')
    WHERE id = ?
  `).run(newVisited ? 1 : 0, newVisitedBy, newVisited ? new Date().toISOString() : null, req.params.id);

  // Log it
  db.prepare(`
    INSERT INTO activity_log (item_id, action, actor)
    VALUES (?, ?, ?)
  `).run(req.params.id, newVisited ? 'visited' : 'unvisited', actor);

  const updated = db.prepare('SELECT * FROM items WHERE id = ?').get(req.params.id);
  res.json({ item: updated });
});

// ── DELETE /items/:id ─────────────────────────────────────────────────────
router.delete('/:id', (req, res) => {
  const db = getDb();
  const item = db.prepare('SELECT * FROM items WHERE id = ?').get(req.params.id);
  if (!item) return res.status(404).json({ error: 'Item not found' });

  db.prepare('DELETE FROM items WHERE id = ?').run(req.params.id);
  res.json({ deleted: true, id: parseInt(req.params.id) });
});

export default router;
