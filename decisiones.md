# Frameworks de testing elegidos

1. Backend (Node.js + Express):
- Jest: framework de testing rápido y ampliamente usado en proyectos JS.
- Supertest: permite testear endpoints HTTP simulando requests sin levantar el servidor real.
- SQLite in-memory: usado para los tests en lugar de MySQL, lo que permite ejecutar pruebas aisladas sin depender de una base de datos externa.

2. Frontend (React):
- Jest: framework integrado por defecto con Create React App.
- React Testing Library (@testing-library/react): para testear componentes React a nivel de usuario (interacciones y contenido renderizado).
- @testing-library/jest-dom: agrega matchers personalizados como toBeInTheDocument.
- Axios (mockeado con Jest): se utiliza en los servicios para llamadas HTTP, pero en los tests se reemplaza por un mock para aislar dependencias externas.

# Estrategia de mocking

1. Backend:
- La conexión real a MySQL fue reemplazada por SQLite en memoria, usando sequelize.sync({ force: true }) para crear las tablas al inicio de cada suite.
- Esto asegura independencia de datos, tests reproducibles y sin riesgos para la DB real.

2. Frontend:
- Se creó un mock de Axios con Jest (jest.mock('axios')) para simular respuestas de la API.
- Esto evita depender del backend durante las pruebas de frontend y permite verificar que los métodos (axios.get) son llamados correctamente.

# Casos de prueba implementados
1. Backend
- GET /ping → responde con { message: "pong" }.
- GET /users → devuelve un arreglo (vacío al inicio, ya que se usa SQLite in-memory).
- POST /users → crea un usuario válido y devuelve status 201.
- POST /users sin email → devuelve error de validación.
- PUT /users/:id → actualiza un usuario existente.
- PUT /users/:id con ID inexistente → responde 404.
- DELETE /users/:id → elimina un usuario existente.
- DELETE /users/:id con ID inexistente → responde 404.

<img width="894" height="577" alt="image-2" src="https://github.com/user-attachments/assets/df49d20e-5326-4c83-9d1f-43c579073df4" />

2. Frontend
- App.test.js → verifica que se renderice el título de la aplicación.
- userService.test.js → prueba que el servicio getAllUsers devuelva usuarios mockeados y llame a axios.get('/users').
- UserList.test.js → renderiza la lista de usuarios usando el servicio mockeado.
- Validación de casos edge en frontend: renderizado correcto cuando el arreglo está vacío.

<img width="403" height="311" alt="image-3" src="https://github.com/user-attachments/assets/a31a00d8-8992-4d51-98c3-e97d5aaadf2c" />



# Integración con CI/CD

- Se configuró el pipeline en Azure DevOps para ejecutar npm test en frontend y backend dentro de la stage Build and Test.

- Solo si los tests pasan, el pipeline continúa con Deploy QA y luego con Deploy PROD.

- Esto asegura que únicamente versiones validadas lleguen a entornos finales.

<img width="770" height="528" alt="image-7" src="https://github.com/user-attachments/assets/b74a09a6-892b-4f2b-a8af-a1700a527499" />


<img width="767" height="526" alt="image-8" src="https://github.com/user-attachments/assets/bc28789c-0556-453b-918f-43d86e7e0fc8" />

---

Secciones prácticas (qué mostrar y comandos exactos)

1) Generar tests y JUnit localmente (Windows cmd)

Backend:
```
cd C:\Users\BANGHO\TP6\backend
npm install
npm test
set JEST_JUNIT_OUTPUT=./test-results/backend-junit.xml
mkdir test-results 2>nul
npm run test:ci
type test-results\backend-junit.xml
```

Frontend:
```
cd C:\Users\BANGHO\TP6\frontend
npm install
set JEST_JUNIT_OUTPUT=./test-results/frontend-junit.xml
mkdir test-results 2>nul
npm run test:ci
type test-results\frontend-junit.xml
```

2) Probar la API en QA (curl / PowerShell)

Crear usuario (esperado 201):
```
curl -i -H "Content-Type: application/json" -d "{\"name\":\"demo_alumno\",\"email\":\"a@x.com\"}" https://tp05-backend-qa-chdtg5exgzarc7hd.brazilsouth-01.azurewebsites.net/users
```

Crear duplicado (esperado 409):
```
curl -i -H "Content-Type: application/json" -d "{\"name\":\"demo_alumno\",\"email\":\"b@x.com\"}" https://tp05-backend-qa-chdtg5exgzarc7hd.brazilsouth-01.azurewebsites.net/users
```

O bien ejecutar el script de smoke del repo (PowerShell):
```
powershell -ExecutionPolicy Bypass -File .\smoke_qa.ps1
```

Dónde están los XML / artefactos de tests
- Backend JUnit XML: `backend/test-results/backend-junit.xml` (también generado temporalmente como `backend/junit.xml`).
- Frontend JUnit XML: `frontend/test-results/frontend-junit.xml`.
- Artefactos del pipeline: `drop-front` y `drop-back` (en la UI del run).

Evidencias recomendadas para entrega
- `decisiones.md` (este archivo) — estrategia y comandos.
- `backend/test-results/backend-junit.xml` y `frontend/test-results/frontend-junit.xml`.
- Captura o screenshot de la pestaña "Tests" en Azure DevOps para la ejecución del pipeline.
- Log de `smoke_qa.ps1` o salida de los `curl` (201 y 409).
- (Opcional) captura del log de migración que muestre "UNIQUE index applied successfully" si corresponde.

Declaración de uso de IA (obligatoria por la consigna)
- Se utilizó asistencia de IA para generar y refactorizar tests, proponer y editar el pipeline YAML, y ayudar a redactar documentación y scripts de prueba. Específicamente las siguientes partes fueron asistidas por IA y luego verificadas manualmente por el autor:
	- Creación de `backend/tests/user.service.unit.test.js` (mock de Sequelize y supertest flows).
	- Ajustes en `frontend/src/components/UserList.js` para robustez en tests y creación de `frontend/src/components/UserForm.test.js`.
	- Configuración e integración de `jest-junit` en `backend/package.json` y `frontend/package.json` y los scripts `test:ci`.
	- Edición de `azure-pipelines.yml` para ejecutar `test:ci` y publicar resultados JUnit.

Guion breve para la defensa (3 minutos)
1. Objetivo y entrega (30s): explicar que el TP pide suite de unit + integración, CI que corre tests y genera reportes, y evidencias (xml + screenshots).
2. Estrategia técnica (60s): explicar por qué se mockea DB en unit tests, por qué usamos sqlite in-memory para integración y qué se prueba en frontend (componentes + servicios). Mostrar `decisiones.md` y los tests claves.
3. Demo (90s): ejecutar `npm run test:ci` en backend y frontend (o mostrar XMLs), luego ejecutar un `curl` a QA para crear usuario y mostrar la respuesta 201; repetir para el duplicado y mostrar 409. Concluir mostrando la pestaña Tests en Azure DevOps.

Checklist rápido antes de presentar
- [ ] `decisiones.md` presente y abierto.
- [ ] `backend/test-results/backend-junit.xml` y `frontend/test-results/frontend-junit.xml` generados.
- [ ] Pipeline: Variable Group `DBSecrets` y `StaticWebAppTokens` autorizados.
- [ ] Si vas a correr migraciones en PROD: hacer backup antes.

