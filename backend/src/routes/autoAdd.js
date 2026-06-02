import { Router } from 'express';
import { getDb } from '../db/schema.js';
import { callClaude } from '../services/claude.js';

const router = Router();

const CATEGORIES = [
  'Events & Entertainment',
  'Active & Outdoors',
  'Fun & Quirky',
  'Shopping',
  'Bars & Nightlife',
  'Coffee & Cafés',
  'Food — Breakfast & Brunch',
  'Food — Lunch & Dinner',
  'Hikes & Day Trips',
  'Winter',
];

const NEIGHBORHOODS = [
  'Uptown', 'NoDa', 'Plaza Midwood', 'South End', 'Dilworth',
  'Elizabeth', 'Myers Park', 'Camp North End', 'Villa Heights',
  'University City', 'SouthPark', 'West Charlotte', 'Huntersville',
  'Cornelius', 'Matthews', 'Fort Mill', 'Lake Norman', 'Charlotte',
];

// ── POST /auto-add/parse ──────────────────────────────────────────────────
// Accepts: { url?, text? }
// Fetches URL content server-side (avoids CORS), then asks Claude to parse
router.post('/parse', async (req, res) => {
  const { url, text } = req.body;

  if (!url && !text) {
    return res.status(400).json({ error: 'url or text required' });
  }

  let content = text || '';

  // Fetch URL content server-side
  if (url) {
    try {
      const response = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Charlotte-App/1.0)' },
        signal: AbortSignal.timeout(8000),
      });
      const html = await response.text();
      // Strip HTML tags for a clean text version
      content = html
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 4000); // Truncate for prompt
    } catch (err) {
      return res.status(422).json({ error: `Could not fetch URL: ${err.message}` });
    }
  }

  const prompt = `You are helping parse information about an activity or event for a Charlotte, NC bucket list app.

Parse the following content and extract structured information.

Content:
"""
${content}
"""

Available categories: ${CATEGORIES.join(', ')}
Known Charlotte neighborhoods: ${NEIGHBORHOODS.join(', ')}

Rules:
- If it's a ticketed event, set ticket_required to true
- If it has a specific date, include it as event_date (ISO format YYYY-MM-DD)
- If it's a weekly recurring event, set recurrence to "weekly" and day_of_week to the day name
- time_of_day must be one of: morning, afternoon, evening, any
- If tickets are required and there's a date, set remind_days_before to 14
- Keep description under 150 characters and conversational
- If you can't determine a field, use null

Return ONLY valid JSON, no markdown, no explanation:
{
  "name": "event or place name",
  "category": "one of the available categories",
  "description": "brief description",
  "address": "full address if found, else null",
  "neighborhood": "Charlotte neighborhood if determinable, else null",
  "time_of_day": "morning | afternoon | evening | any",
  "day_of_week": "day name if recurring, else null",
  "recurrence": "weekly | monthly | annual | null",
  "event_date": "YYYY-MM-DD or null",
  "ticket_required": false,
  "remind_days_before": 0,
  "external_url": "the original URL if provided, else null",
  "ticket_url": "direct ticket purchase URL if found, else null",
  "confidence": "high | medium | low"
}`;

  try {
    const response = await callClaude(prompt, 600);
    const parsed = JSON.parse(response);

    res.json({
      parsed,
      source_url: url || null,
    });
  } catch (err) {
    console.error('Parse error:', err);
    res.status(500).json({ error: 'Failed to parse content' });
  }
});

// ── POST /auto-add/save ───────────────────────────────────────────────────
// Save a parsed item after user confirms
router.post('/save', (req, res) => {
  const db = getDb();
  const {
    name, category, description,
    address, neighborhood, lat, lng, drive_time,
    time_of_day, day_of_week, recurrence, event_date,
    ticket_required, remind_days_before,
    external_url, ticket_url,
  } = req.body;

  if (!name || !category) {
    return res.status(400).json({ error: 'name and category are required' });
  }

  const result = db.prepare(`
    INSERT INTO items (
      name, category, description,
      address, neighborhood, lat, lng, drive_time,
      time_of_day, day_of_week, recurrence, event_date,
      ticket_required, remind_days_before,
      external_url, ticket_url, source
    ) VALUES (
      @name, @category, @description,
      @address, @neighborhood, @lat, @lng, @drive_time,
      @time_of_day, @day_of_week, @recurrence, @event_date,
      @ticket_required, @remind_days_before,
      @external_url, @ticket_url, 'auto-add'
    )
  `).run({
    name, category,
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
  });

  db.prepare(`
    INSERT INTO activity_log (item_id, action, actor)
    VALUES (?, 'added', 'manue')
  `).run(result.lastInsertRowid);

  const item = db.prepare('SELECT * FROM items WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json({ item });
});

export default router;
