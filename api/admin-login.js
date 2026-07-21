import crypto from 'crypto';

// Duración de la sesión: 12 horas
const SESSION_DURATION_MS = 12 * 60 * 60 * 1000;

function sign(value, secret) {
  return crypto.createHmac('sha256', secret).update(value).digest('hex');
}

export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).send('Método no permitido');
    return;
  }

  const adminPassword = process.env.ADMIN_PASSWORD;
  const secret = process.env.ADMIN_SECRET;

  if (!adminPassword || !secret) {
    res.status(500).send('Faltan ADMIN_PASSWORD / ADMIN_SECRET en Vercel (Settings → Environment Variables).');
    return;
  }

  const { password } = req.body || {};

  if (!password || password !== adminPassword) {
    res.status(401).json({ ok: false, error: 'Contraseña incorrecta.' });
    return;
  }

  const expiry = Date.now() + SESSION_DURATION_MS;
  const signature = sign(String(expiry), secret);
  const cookieValue = `${expiry}.${signature}`;

  const host = req.headers.host || '';
  const isLocal = host.includes('localhost');

  res.setHeader('Set-Cookie', [
    `admin_session=${cookieValue}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_DURATION_MS / 1000}${isLocal ? '' : '; Secure'}`,
  ]);

  res.status(200).json({ ok: true });
}
