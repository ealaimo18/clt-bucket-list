import { Router } from 'express';
import { getDb } from '../db/schema.js';
import { callClaude } from '../services/claude.js';

const router = Router();

// ── GET /plans ────────────────────────────────────────────────────────────
router.get('/', (req, res) => {
  const db = getDb();
  const plans = db.prepare(`
    SELECT p.*,
      COUNT(pi.id) as stop_count
    FROM plans p
    LEFT JOIN plan_items pi ON pi.plan_id = p.id
    GROUP BY p.id
    ORDER BY p.plan_date DESC, p.created_at DESC
    LIMIT 20
  `).all();
  res.json({ plans });
});

// ── GET /plans/:id ────────────────────────────────────────────────────────
router.get('/:id', (req, res) => {
  const db = getDb();
  const plan = db.prepare('SELECT * FROM plans WHERE id = ?').get(req.params.id);
  if (!plan) return res.status(404).json({ error: 'Plan not found' });

  const items = db.prepare(`
    SELECT pi.*, i.*,
      pi.id as plan_item_id,
      pi.arrival_time, pi.note, pi.position
    FROM plan_items pi
    JOIN items i ON i.id = pi.item_id
    WHERE pi.plan_id = ?
    ORDER BY pi.position
  `).all(req.params.id);

  res.json({ plan, items });
});

// ── POST /plans ───────────────────────────────────────────────────────────
router.post('/', (req, res) => {
  const db = getDb();
  const { title, plan_date, vibe } = req.body;

  const result = db.prepare(`
    INSERT INTO plans (title, plan_date, vibe)
    VALUES (@title, @plan_date, @vibe)
  `).run({
    title: title || null,
    plan_date: plan_date || new Date().toISOString().split('T')[0],
    vibe: vibe || null,
  });

  const plan = db.prepare('SELECT * FROM plans WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json({ plan });
});

// ── POST /plans/:id/items ─────────────────────────────────────────────────
// Add an item to a plan
router.post('/:id/items', (req, res) => {
  const db = getDb();
  const { item_id, arrival_time, note } = req.body;

  if (!item_id) return res.status(400).json({ error: 'item_id required' });

  const maxPos = db.prepare(`
    SELECT COALESCE(MAX(position), 0) as max FROM plan_items WHERE plan_id = ?
  `).get(req.params.id);

  db.prepare(`
    INSERT INTO plan_items (plan_id, item_id, position, arrival_time, note)
    VALUES (?, ?, ?, ?, ?)
  `).run(req.params.id, item_id, maxPos.max + 1, arrival_time || null, note || null);

  res.json({ added: true });
});

// ── DELETE /plans/:id/items/:itemId ──────────────────────────────────────
router.delete('/:id/items/:itemId', (req, res) => {
  const db = getDb();
  db.prepare('DELETE FROM plan_items WHERE plan_id = ? AND id = ?')
    .run(req.params.id, req.params.itemId);
  res.json({ removed: true });
});

// ── POST /plans/suggest ───────────────────────────────────────────────────
// AI-powered day plan suggestion
// Body: { anchor_item_id, vibe, date, neighborhood }
router.post('/suggest', async (req, res) => {
  const db = getDb();
  const { anchor_item_id, vibe, date, neighborhood } = req.body;

  // Get anchor item
  const anchor = anchor_item_id
    ? db.prepare('SELECT * FROM items WHERE id = ?').get(anchor_item_id)
    : null;

  // Get unvisited items — optionally filtered by neighborhood
  let candidateQuery = 'SELECT * FROM items WHERE visited = 0';
  const params = [];
  if (neighborhood) {
    candidateQuery += ' AND neighborhood = ?';
    params.push(neighborhood);
  }
  candidateQuery += ' ORDER BY RANDOM() LIMIT 30';
  const candidates = db.prepare(candidateQuery).all(...params);

  const prompt = `You are helping plan a day of activities in Charlotte, NC.

${anchor ? `The anchor activity is: ${anchor.name} (${anchor.category}, ${anchor.neighborhood}, ${anchor.time_of_day})` : ''}
${vibe ? `The desired vibe is: ${vibe}` : ''}
${date ? `The date is: ${date}` : ''}

Here are candidate activities to choose from (unvisited):
${candidates.map(i => `- ID:${i.id} | ${i.name} | ${i.category} | ${i.neighborhood} | ${i.time_of_day} | ${i.drive_time}`).join('\n')}

Pick 3-5 activities that make a great day together. Consider:
- Logical time flow (morning → afternoon → evening)
- Geographic proximity (group by neighborhood when possible)
- Mix of activity types that match the vibe
- Don't pick more than 2 from the same category

Return ONLY valid JSON, no markdown, no explanation:
{
  "title": "short catchy plan name",
  "stops": [
    {
      "item_id": <number>,
      "arrival_time": "9:00 AM",
      "note": "brief tip for this stop"
    }
  ],
  "summary": "one sentence describing the day"
}`;

  try {
    const response = await callClaude(prompt, 800);
    const parsed = JSON.parse(response);

    // Hydrate with full item data
    const stops = parsed.stops.map(stop => {
      const item = db.prepare('SELECT * FROM items WHERE id = ?').get(stop.item_id);
      return { ...stop, item };
    }).filter(s => s.item);

    res.json({
      title: parsed.title,
      summary: parsed.summary,
      stops,
    });
  } catch (err) {
    console.error('Plan suggestion error:', err);
    res.status(500).json({ error: 'Failed to generate plan suggestion' });
  }
});

export default router;
