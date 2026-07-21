# Tec-Star-depuraciones-
# Cómo activar el panel de edición (/admin)

Este panel es **propio del sitio** (no usa login de GitHub). El cliente entra con una contraseña simple; por detrás, el servidor hace el commit a GitHub usando tu token.

## 1. Estructura del proyecto
```
index.html
logo.png
content/site.json
admin/index.html
api/admin-login.js
api/admin-logout.js
api/admin-check.js
api/admin-save.js
api/_session.js
```

## 2. Crear un Personal Access Token de GitHub
1. GitHub → foto de perfil → **Settings** → **Developer settings** → **Personal access tokens** → **Fine-grained tokens** (o "Tokens classic").
2. Dale acceso de **escritura (contents: read and write)** solo al repo `Tec-Star-depuraciones-`.
3. Copia el token generado (empieza con `github_pat_...` o `ghp_...`). Solo se muestra una vez.

## 3. Agregar las variables de entorno en Vercel
En el proyecto de Vercel → **Settings** → **Environment Variables**, agrega:
- `GITHUB_TOKEN` → el token que generaste en el paso 2
- `ADMIN_PASSWORD` → la contraseña que usará el cliente para entrar a `/admin`
- `ADMIN_SECRET` → cualquier texto largo y aleatorio (solo se usa para firmar la sesión, no lo comparte nadie)

Vuelve a desplegar (redeploy) para que tomen efecto.

## 4. Dar acceso al cliente
El cliente **no necesita cuenta de GitHub ni saber nada de código**. Solo entra a `tusitio.vercel.app/admin`, escribe la contraseña que tú le diste, y edita con el formulario. La sesión dura 12 horas antes de pedir la contraseña otra vez.

## Cómo funciona
Cada cambio que el cliente guarda en `/admin` llama a `/api/admin-save`, que usa tu `GITHUB_TOKEN` para hacer un commit directo al archivo `content/site.json`. Ese commit dispara el build automático de Vercel (igual que cuando tú subes cambios), y el sitio se actualiza solo en 1-2 minutos.

## Qué puede editar el cliente
- Texto del hero, párrafos de "Quiénes somos", pie de página
- Teléfono, WhatsApp, correo, nombre de contacto, dirección
- Los 5 bloques de servicios (etiqueta, título y lista de puntos — puede agregar o quitar puntos)
- Los 6 bloques de "Por qué elegirnos"

Lo que **no** puede tocar desde aquí: la estructura visual, colores, el diseño general, ni el logo — eso sigue siendo trabajo tuyo en el `index.html` / `content/site.json`.

## Nota de seguridad
- `GITHUB_TOKEN` y `ADMIN_SECRET` viven solo en Vercel (nunca en el navegador del cliente).
- Si algún día quieres cambiar la contraseña del cliente, solo edita `ADMIN_PASSWORD` en Vercel y haz redeploy.
- Si quieres revocar el token de GitHub, bórralo desde GitHub → Settings → Personal access tokens y genera uno nuevo.
