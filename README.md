# TP06 - Pruebas Unitarias (Resumen y comandos)

Este repositorio contiene frontend (React) y backend (Node/Express + Sequelize).

Cambios implementados para TP06:
- Validación de palabras inapropiadas (backend + frontend).
- Prevención de nombres duplicados al crear (POST) y al editar (PUT) en backend.
- Validaciones espejo en frontend (bloquea envío y muestra error).
- Tests nuevos: backend integration tests para badwords y duplicate-on-update; frontend component tests para validaciones.

Cómo ejecutar los tests localmente (Windows cmd):

Backend:
```
cd C:\Users\BANGHO\TP6\backend
npm ci
set JEST_JUNIT_OUTPUT=./test-results/backend-junit.xml
mkdir test-results 2>nul
npm run test:ci
```

Frontend:
```
cd C:\Users\BANGHO\TP6\frontend
npm ci
set JEST_JUNIT_OUTPUT=./test-results/frontend-junit.xml
mkdir test-results 2>nul
npm run test:ci
```

Notas:
- Los tests del backend usan sqlite in-memory cuando NODE_ENV=test.
- La lista de palabras prohibidas está en `backend/utils/badwords.js` y `frontend/src/utils/badwords.js` (puedes ajustarla).
- `decisiones.md` documenta la estrategia y evidencia requerida.
