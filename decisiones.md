# Decisiones y estrategia de testing - TP06

Resumen rápido
- Frameworks usados: Jest (backend y frontend), Supertest (backend integration), sqlite3 in-memory para tests de integración, jest-junit para reportes JUnit.
- Mocking: En tests unitarios de backend se mockea Sequelize (findOne/create) para aislar lógica. En frontend se mockea el service (axios) para no llamar a la API.

Ejecución local
- Backend (unit/integration):
  - cd backend
  - npm install
  - npm test            # run all tests
  - set JEST_JUNIT_OUTPUT=./test-results/backend-junit.xml && npm run test:ci   # generate junit xml (Windows cmd)

- Frontend:
  - cd frontend
  - npm install
  - npm test
  - set JEST_JUNIT_OUTPUT=./test-results/frontend-junit.xml && npm run test:ci

CI
- Azure Pipelines: el pipeline ejecuta ambos `test:ci` (frontend y backend) y publica `**/test-results/*.xml` usando PublishTestResults.

Qué se mockea y por qué
- DB en unit tests: mockear Sequelize evita dependencia de BD real y permite probar solo la lógica de control y manejo de errores.
- Requests HTTP en frontend: mockear axios evita flakiness y permite validar comportamiento del UI ante respuestas simuladas.

Uso de IA
- Se usó asistencia para generar tests y ajustes en pipeline. Todas las modificaciones fueron revisadas y ejecutadas localmente; se documenta qué archivos fueron creados/alterados.

Evidencias
- `evidencias/` contiene los xml generados y capturas de pantalla con resultados de tests.

Notas de despliegue
- Antes de correr migraciones en PROD hacer backup y revisar duplicados en QA.
