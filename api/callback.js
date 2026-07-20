export default async function handler(req, res) {
  const { code } = req.query;
  const clientId = process.env.OAUTH_GITHUB_CLIENT_ID;
  const clientSecret = process.env.OAUTH_GITHUB_CLIENT_SECRET;

  if (!code) {
    res.status(400).send('Falta el parámetro "code" de GitHub.');
    return;
  }
  if (!clientId || !clientSecret) {
    res.status(500).send('Faltan OAUTH_GITHUB_CLIENT_ID / OAUTH_GITHUB_CLIENT_SECRET en Vercel.');
    return;
  }

  try {
    const tokenResp = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code }),
    });
    const tokenData = await tokenResp.json();

    if (!tokenData.access_token) {
      res.status(400).send('No se pudo obtener el token de GitHub: ' + JSON.stringify(tokenData));
      return;
    }

    const payload = JSON.stringify({ token: tokenData.access_token, provider: 'github' });

    // Protocolo que espera Decap CMS: postMessage a la ventana que abrió el login
    const html = `
      <!DOCTYPE html><html><body>
      <script>
        (function () {
          function receiveMessage() {
            window.opener.postMessage(
              'authorization:github:success:${payload.replace(/'/g, "\\'")}',
              '*'
            );
            window.removeEventListener('message', receiveMessage, false);
          }
          window.addEventListener('message', receiveMessage, false);
          window.opener.postMessage('authorizing:github', '*');
        })();
      </script>
      Autenticación completa, puedes cerrar esta ventana.
      </body></html>`;

    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(html);
  } catch (err) {
    res.status(500).send('Error al conectar con GitHub: ' + err.message);
  }
}
