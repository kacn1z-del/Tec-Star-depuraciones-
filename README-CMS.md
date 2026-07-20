# Tec-Star-depuraciones-
# Cómo activar el panel de edición (/admin)

## 1. Subir los archivos al repo
Estructura final:
```
index.html
logo.png
content/site.json
admin/index.html
admin/config.yml
api/auth.js
api/callback.js
```

## 2. Editar admin/config.yml
Cambia estas 3 líneas por los datos reales:
- `repo:` → usuario/nombre-del-repo (ej: `guisella/tec-star`)
- `branch:` → el nombre de tu rama principal (usualmente `main`)
- `base_url:` → la URL de Vercel del sitio (ej: `https://tec-star.vercel.app`)

## 3. Crear la OAuth App en GitHub
1. GitHub → foto de perfil → **Settings** → **Developer settings** → **OAuth Apps** → **New OAuth App**.
2. **Homepage URL**: la URL de tu sitio en Vercel.
3. **Authorization callback URL**: `https://TU-SITIO.vercel.app/api/callback`
4. Guarda y copia el **Client ID** y genera un **Client Secret**.

## 4. Agregar las variables de entorno en Vercel
En el proyecto de Vercel → **Settings** → **Environment Variables**, agrega:
- `OAUTH_GITHUB_CLIENT_ID`
- `OAUTH_GITHUB_CLIENT_SECRET`

Vuelve a desplegar (redeploy) para que tomen efecto.

## 5. Dar acceso al cliente
El cliente necesita una cuenta de GitHub con acceso de **colaborador** al repositorio (Settings → Collaborators, en el repo). No necesita saber nada de código: solo entra a `tusitio.vercel.app/admin`, inicia sesión con GitHub y edita con formularios.

## Cómo funciona
Cada cambio que el cliente guarda en `/admin` se convierte en un commit al archivo `content/site.json`. Ese commit dispara el build automático de Vercel (igual que cuando tú subes cambios), y el sitio se actualiza solo en 1-2 minutos.

## Qué puede editar el cliente
- Logo
- Texto del hero, párrafos de "Quiénes somos", pie de página
- Teléfono, WhatsApp, correo, nombre de contacto, dirección
- Los 4 bloques de servicios (título y lista de puntos)
- Los 6 bloques de "Por qué elegirnos"

Lo que **no** puede tocar desde aquí: la estructura visual, colores o el diseño general — eso sigue siendo trabajo tuyo en el `index.html`.
