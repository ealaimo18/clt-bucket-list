import { Router } from 'express';
import { getDb } from '../db/schema.js';

const router = Router();

// ── GET /recommendations ─────────────────────────────────────────────────
// Returns time-aware recommendations grouped into sections
// Query: ?time_of_day=morning&day=thursday&lat=35.2&lng=-80.8
router.get('/', (req, res) => {
  const db = getDb();

  const now = new Date();
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const currentDay = dayNames[now.getDay()];
  const currentHour = now.getHours();

  // Determine time of day
  let timeOfDay;
  if (currentHour >= 5 && currentHour < 11) timeOfDay = 'morning';
  else if (currentHour >= 11 && currentHour < 17) timeOfDay = 'afternoon';
  else timeOfDay = 'evening';

  // Override from query params if provided
  const day = req.query.day || currentDay;
  const tod = req.query.time_of_day || timeOfDay;
  const { lat, lng } = req.query;

  const sections = [];

  // Section 1: Happening today (recurring events that match today's day)
  const happeningToday = db.prepare(`
    SELECT * FROM items
    WHERE visited = 0
      AND day_of_week = ?
    ORDER BY name
    LIMIT 8
  `).all(day);

  if (happeningToday.length > 0) {
    sections.push({
      id: 'happening_today',
      title: 'Happening today',
      subtitle: `Recurring on ${capitalize(day)}s`,
      items: happeningToday,
    });
  }

  // Section 2: Good for this time of day
  const timeRecs = db.prepare(`
    SELECT * FROM items
    WHERE visited = 0
      AND (time_of_day = ? OR time_of_day = 'any')
      AND day_of_week IS NULL
    ORDER BY RANDOM()
    LIMIT 8
  `).all(tod);

  if (timeRecs.length > 0) {
    const timeLabel = {
      morning: 'Good for this morning',
      afternoon: 'Good for this afternoon',
      evening: 'Good for tonight',
    }[tod];

    sections.push({
      id: 'time_of_day',
      title: timeLabel,
      subtitle: `Fits a ${tod} vibe`,
      items: timeRecs,
    });
  }

  // Section 3: Tickets needed soon (events within remind_days_before)
  const ticketUrgent = db.prepare(`
    SELECT * FROM items
    WHERE visited = 0
      AND ticket_required = 1
      AND event_date IS NOT NULL
      AND date(event_date) > date('now')
      AND julianday(event_date) - julianday('now') <= remind_days_before
    ORDER BY event_date
    LIMIT 4
  `).all();

  if (ticketUrgent.length > 0) {
    sections.push({
      id: 'ticket_urgency',
      title: 'Buy tickets soon',
      subtitle: 'These are coming up fast',
      urgent: true,
      items: ticketUrgent,
    });
  }

  // Section 4: Nearby (if coords provided)
  if (lat && lng) {
    const nearby = db.prepare(`
      SELECT *,
        (6371 * acos(
          cos(radians(?)) * cos(radians(lat)) *
          cos(radians(lng) - radians(?)) +
          sin(radians(?)) * sin(radians(lat))
        )) AS distance_km
      FROM items
      WHERE lat IS NOT NULL AND visited = 0
      HAVING distance_km < 3
      ORDER BY distance_km
      LIMIT 6
    `).all(lat, lng, lat);

    if (nearby.length > 0) {
      sections.push({
        id: 'nearby',
        title: 'Close to you right now',
        subtitle: 'Within ~3 km',
        items: nearby,
      });
    }
  }

  // Section 5: Haven't explored this category yet
  const untouchedCategory = db.prepare(`
    SELECT category, COUNT(*) as total, SUM(visited) as done
    FROM items
    GROUP BY category
    HAVING done = 0
    ORDER BY RANDOM()
    LIMIT 1
  `).get();

  if (untouchedCategory) {
    const untouched = db.prepare(`
      SELECT * FROM items
      WHERE category = ? AND visited = 0
      ORDER BY RANDOM()
      LIMIT 5
    `).all(untouchedCategory.category);

    sections.push({
      id: 'unexplored',
      title: `Explore ${untouchedCategory.category}`,
      subtitle: `You haven't been to any of these yet`,
      items: untouched,
    });
  }

  // Stats summary
  const stats = db.prepare(`
    SELECT
      COUNT(*) as total,
      SUM(visited) as visited,
      COUNT(DISTINCT category) as categories
    FROM items
  `).get();

  res.json({
    sections,
    meta: {
      time_of_day: tod,
      day,
      stats,
    },
  });
});

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default router;
