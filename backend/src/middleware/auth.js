// Simple shared-passphrase auth
// Both you and your partner use the same passphrase in the Authorization header:
//   Authorization: Bearer <SHARED_PASSPHRASE>
// This is enough for a private app used by two people.
// Upgrade to proper JWT when hosting publicly.

export function auth(req, res, next) {
  const passphrase = process.env.SHARED_PASSPHRASE;

  // If no passphrase set, auth is disabled (local dev)
  if (!passphrase) {
    req.actor = 'manue';
    return next();
  }

  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token || token !== passphrase) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Identify actor by optional header — defaults to 'manue'
  req.actor = req.headers['x-actor'] || 'manue';
  next();
}
