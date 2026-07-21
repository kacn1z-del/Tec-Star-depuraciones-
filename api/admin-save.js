import { isAuthenticated } from './_session.js';

// Repo destino (mismo que admin/config.yml)
const OWNER = 'Kacn1z-del';
const REPO = 'Tec-Star-depuraciones-';
const BRANCH = 'main';
const FILE_PATH = 'content/site.json';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).send('Método no permitido');
    return;
  }

  if (!isAuthenticated(req)) {
    res.status(401).json({ ok: false, error: 'Sesión inválida o expirada. Vuelve a iniciar sesión.' });
    return;
  }

  const githubToken = process.env.GITHUB_TOKEN;
  if (!githubToken) {
    res.status(500).json({ ok: false, error: 'Falta GITHUB_TOKEN en Vercel (Settings → Environment Variables).' });
    return;
  }

  const newContent = req.body;
  if (!newContent || typeof newContent !== 'object') {
    res.status(400).json({ ok: false, error: 'Datos inválidos.' });
    return;
  }

  const apiUrl = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${FILE_PATH}`;
  const headers = {
    Authorization: `Bearer ${githubToken}`,
    Accept: 'application/vnd.github+json',
    'Content-Type': 'application/json',
  };

  try {
    // 1. Obtener el sha actual del archivo (requerido por GitHub para actualizar)
    const getResp = await fetch(`${apiUrl}?ref=${BRANCH}`, { headers });
    if (!getResp.ok) {
      const errText = await getResp.text();
      res.status(502).json({ ok: false, error: `No se pudo leer el archivo actual en GitHub: ${errText}` });
      return;
    }
    const getData = await getResp.json();
    const sha = getData.sha;

    // 2. Preparar el nuevo contenido en base64
    const jsonText = JSON.stringify(newContent, null, 2);
    const base64Content = Buffer.from(jsonText, 'utf-8').toString('base64');

    // 3. Hacer el commit vía PUT
    const putResp = await fetch(apiUrl, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        message: 'Actualización de contenido desde el panel de administración',
        content: base64Content,
        sha,
        branch: BRANCH,
      }),
    });

    if (!putResp.ok) {
      const errText = await putResp.text();
      res.status(502).json({ ok: false, error: `No se pudo guardar en GitHub: ${errText}` });
      return;
    }

    res.status(200).json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, error: `Error de conexión con GitHub: ${err.message}` });
  }
}
