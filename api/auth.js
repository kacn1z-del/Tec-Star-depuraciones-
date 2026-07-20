export default function handler(req, res) {
  const clientId = process.env.OAUTH_GITHUB_CLIENT_ID;
  const host = req.headers.host;
  const protocol = host && host.includes('localhost') ? 'http' : 'https';
  const redirectUri = `${protocol}://${host}/api/callback`;

  if (!clientId) {
    res.status(500).send('Falta configurar OAUTH_GITHUB_CLIENT_ID en Vercel (Settings → Environment Variables).');
    return;
  }

  const authorizeUrl =
    `https://github.com/login/oauth/authorize` +
    `?client_id=${encodeURIComponent(clientId)}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&scope=repo,user`;

  res.writeHead(302, { Location: authorizeUrl });
  res.end();
}
