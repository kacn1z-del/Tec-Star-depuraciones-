import { isAuthenticated } from './_session.js';

export default function handler(req, res) {
  res.status(200).json({ authenticated: isAuthenticated(req) });
}
