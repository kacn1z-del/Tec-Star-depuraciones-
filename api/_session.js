import crypto from 'crypto';

function sign(value, secret) {
  return crypto.createHmac('sha256', secret).update(value).digest('hex');
}

function parseCookies(header) {
  const out = {};
  if (!header) return out;
  header.split(';').forEach((part) => {
    const idx = part.indexOf('=');
    if (idx === -1) return;
    const key = part.slice(0, idx).trim();
    const val = part.slice(idx + 1).trim();
    out[key] = val;
  });
  return out;
}

// Devuelve true si la cookie admin_session es válida y no ha expirado
export function isAuthenticated(req) {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;

  const cookies = parseCookies(req.headers.cookie);
  const raw = cookies.admin_session;
  if (!raw) return false;

  const [expiryStr, signature] = raw.split('.');
  if (!expiryStr || !signature) return false;

  const expected = sign(expiryStr, secret);
  if (expected !== signature) return false;

  const expiry = Number(expiryStr);
  if (!Number.isFinite(expiry) || Date.now() > expiry) return false;

  return true;
}
