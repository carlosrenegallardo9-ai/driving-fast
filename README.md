# Gallardo Tech

Plataforma web oficial de Gallardo Tech: showroom de productos en 3D, asistente de IA y gamificación ("Tech Quests").

## Documentación

- [Propuesta de diseño, UX y arquitectura](docs/propuesta-ux.md) — sitemap, wireframes, user journey, animaciones, reglas de gamificación y arquitectura técnica.

## Prototipo

Página única con React + Vite, Tailwind, Framer Motion y React Three Fiber.

```bash
npm install
npm run dev        # desarrollo en http://localhost:5173
npm run build      # genera dist/index.html (un solo archivo)
npm run artifact   # genera dist/artifact.html para publicarlo como página
```

Qué incluye:

- **Showroom 3D** (`src/components/Scenes.tsx`, `Device.tsx`): rotación orbital con inercia, 3 acabados que cambian el acento de toda la interfaz, despiece por capas y hotspots.
- **Asistente Nova** (`src/components/Assistant.tsx`, `src/lib/agent.ts`): responde y ejecuta acciones en la página (navegar, abrir producto, cambiar acabado, desarmar, enfocar componente). Es una simulación local; en producción se conecta a un LLM con tool use.
- **Tech Quests** (`src/lib/store.ts`): XP, niveles, misiones diarias y semanales, trivia, XP provisionales y registro para guardarlos.
- **Ranking en vivo** con cuenta regresiva semanal y mensual, recompensas y vitrina de medallas.

Productos, jugadores y premios son de ejemplo. El progreso se guarda sólo en el navegador.
