# SNAP — Frontend

Interfaz de usuario para el acortador de URLs SNAP. Permite registrarse, iniciar sesión, acortar URLs y consultar estadísticas de clicks desde un dashboard.

## Stack

- **Framework:** React 19 + TypeScript + Vite
- **Enrutamiento:** React Router v7
- **Estado global:** Zustand (token persistido en localStorage)
- **Peticiones:** Axios + TanStack React Query v5
- **Estilos:** CSS Modules
- **Notificaciones:** Sonner (toasts)
- **Gráficas:** Recharts
- **Testing:** Vitest + React Testing Library + MSW v2

## Requisitos

- Node.js 20 o superior
- npm 10 o superior
- El [backend de SNAP](https://github.com/tu-usuario/snap-backend) corriendo

## Instalación

```bash
git clone https://github.com/tu-usuario/snap-frontend.git
cd snap-frontend
npm install
cp .env.example .env   # ajusta VITE_API_URL si es necesario
npm run dev
```

La app arranca en `http://localhost:5173`.

## Variables de entorno

Copia `.env.example` a `.env`:

| Variable | Descripción |
|----------|-------------|
| `VITE_API_URL` | URL base del backend, sin slash final (ej. `http://localhost:3000`) |

## Scripts

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build de producción en dist/
npm run preview  # Previsualizar el build localmente
npm test         # Correr 32 tests
```

## Rutas de la aplicación

| Ruta | Acceso | Descripción |
|------|--------|-------------|
| `/login` | Público | Inicio de sesión |
| `/register` | Público | Registro de cuenta |
| `/dashboard` | Privado 🔒 | URLs del usuario, métricas y formulario de creación |

Las rutas privadas redirigen a `/login` si no hay sesión activa.

## Características

- **Autenticación JWT** — token almacenado en localStorage, inyectado automáticamente en cada petición
- **Paginación** — 10 URLs por página con navegación completa (primera, anterior, números, siguiente, última)
- **Indicadores de antigüedad** — badge "Nueva" (<7 días) y "Antigua" (>30 días) en cada URL
- **Creación de URL** — agrega `https://` automáticamente si falta el protocolo
- **Eliminación con confirmación** — doble clic para prevenir borrados accidentales
- **Manejo de errores** — toast en cada error, pantalla de reintento si el dashboard falla
- **Sesión expirada** — detección automática de 401 con redirección al login

## Tests

```bash
npm test
```

32 tests en 5 archivos que cubren páginas de auth, store de autenticación, dashboard y formularios.

## Despliegue en Netlify

1. Conectar el repositorio en [netlify.com](https://netlify.com)
2. Configurar:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
3. Añadir variable de entorno `VITE_API_URL` con la URL del backend en producción
4. El archivo `public/_redirects` ya está incluido para el enrutamiento SPA
