# SNAP — Frontend

Interfaz de usuario para el acortador de URLs SNAP. Permite registrarse, iniciar sesión, acortar URLs y consultar estadísticas de clicks desde un dashboard con analíticas en tiempo real.

> Repositorio del backend: [snap-backend](https://github.com/rapsag79/snap-backend)

---

## Tecnologías utilizadas

### Core

| Tecnología | Versión | Rol |
|------------|---------|-----|
| [React](https://react.dev/) | 19 | Librería de UI — componentes declarativos con el nuevo compilador de React |
| [TypeScript](https://www.typescriptlang.org/) | 6 | Tipado estático en todo el proyecto |
| [Vite](https://vite.dev/) | 8 | Bundler y servidor de desarrollo ultrarrápido con HMR |

### Gestión de estado y datos

| Tecnología | Versión | Rol |
|------------|---------|-----|
| [Zustand](https://zustand.docs.pmnd.rs/) | 5 | Estado global del cliente (sesión del usuario). Persistido en `localStorage` con el middleware `persist` |
| [TanStack React Query](https://tanstack.com/query) | 5 | Estado del servidor (URLs, dashboard). Gestiona caché, revalidación y estados de carga/error automáticamente |
| [Axios](https://axios-http.com/) | 1.x | Cliente HTTP. Interceptores para inyectar el JWT en cada petición y manejar expiración de sesión (401) |

### Enrutamiento

| Tecnología | Versión | Rol |
|------------|---------|-----|
| [React Router](https://reactrouter.com/) | 7 | Enrutamiento declarativo con rutas protegidas que redirigen al login si no hay sesión activa |

### UI y estilos

| Tecnología | Versión | Rol |
|------------|---------|-----|
| CSS Modules | — | Estilos con scope local por componente, sin colisiones de clases |
| [Sonner](https://sonner.emilkowal.ski/) | 2 | Toasts para notificaciones de éxito y error con diseño limpio |
| [Recharts](https://recharts.org/) | 3 | Gráfica de barras para visualizar clicks de los últimos 30 días |

### Testing

| Tecnología | Versión | Rol |
|------------|---------|-----|
| [Vitest](https://vitest.dev/) | 4 | Test runner compatible con Vite, rápido y con soporte nativo a TypeScript |
| [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) | 16 | Tests orientados al comportamiento del usuario, no a la implementación |
| [MSW (Mock Service Worker)](https://mswjs.io/) | 2 | Intercepta peticiones HTTP en los tests sin modificar el código de producción |
| [@testing-library/user-event](https://testing-library.com/docs/user-event/intro/) | 14 | Simula interacciones reales de usuario (click, type, etc.) |

---

## Requisitos

- Node.js 20 o superior
- npm 10 o superior
- El [backend de SNAP](https://github.com/rapsag79/snap-backend) corriendo

## Instalación

```bash
git clone https://github.com/rapsag79/snap-frontend.git
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
npm run dev      # Servidor de desarrollo con HMR
npm run build    # Build de producción en dist/
npm run preview  # Previsualizar el build localmente
npm test         # Correr los 32 tests
```

## Rutas de la aplicación

| Ruta | Acceso | Descripción |
|------|--------|-------------|
| `/login` | Público | Inicio de sesión |
| `/register` | Público | Registro de cuenta nueva |
| `/dashboard` | Privado 🔒 | URLs del usuario, métricas y formulario de creación |

Las rutas privadas redirigen a `/login` si no hay sesión activa.

## Características principales

- **Autenticación JWT** — token almacenado en `localStorage` via Zustand persist, inyectado automáticamente en cada petición a través de un interceptor de Axios
- **Paginación offset** — 10 URLs por página con navegación completa: primera, anterior, páginas numeradas con ellipsis, siguiente y última
- **Indicadores de antigüedad** — badge visual "Nueva" (< 7 días) y "Antigua" (> 30 días) calculado en el cliente a partir de `created_at`
- **Normalización de URLs** — agrega `https://` automáticamente si la URL ingresada no incluye protocolo
- **Eliminación con confirmación** — primer clic muestra botón de confirmación para prevenir borrados accidentales
- **Manejo de errores** — toast informativo en cada error de API, pantalla de reintento si el dashboard falla al cargar
- **Sesión expirada** — el interceptor de respuesta detecta 401 (solo si había token activo) y redirige al login con un toast explicativo

## Arquitectura del proyecto

```
src/
├── api/          # Clientes HTTP (Axios) para cada recurso
├── components/   # Componentes reutilizables (UI + charts)
├── features/     # Módulos por funcionalidad (auth, dashboard, urls)
├── router/       # Configuración de rutas y ProtectedRoute
├── store/        # Estado global con Zustand (auth)
├── tests/        # Tests + mocks de MSW
└── types/        # Interfaces TypeScript compartidas
```

## Tests

```bash
npm test
```

32 tests en 5 archivos:

| Archivo | Tests | Qué cubre |
|---------|-------|-----------|
| `LoginPage.test.tsx` | 5 | Validación de formulario, login exitoso, errores de credenciales |
| `RegisterPage.test.tsx` | 5 | Validación, registro exitoso, email duplicado |
| `auth.store.test.ts` | 4 | Login/logout en el store, persistencia del token |
| `auth.api.test.ts` | 3 | Interceptor JWT, manejo de 401 |
| `dashboard.test.tsx` | 15 | Carga, errores, paginación, badges de antigüedad, formulario de URL |

## Despliegue en Netlify

1. Conectar el repositorio en [netlify.com](https://netlify.com)
2. Configurar:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
3. Añadir variable de entorno `VITE_API_URL` con la URL del backend desplegado
4. El archivo `public/_redirects` ya está incluido para que el enrutamiento SPA funcione correctamente
