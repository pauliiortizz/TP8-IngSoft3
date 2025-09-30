# Decisiones de diseño – TP4

## Stack elegido
- **Frontend:** React 18 (CRA, react-scripts)
- **Backend:** Node.js 18 + Express
- **Gestor de paquetes:** npm
- **CI/CD:** Azure DevOps con agente self-hosted

---

## Estructura del repositorio
El repositorio se organizó como **mono-repo** con la siguiente estructura:

- /frontend 
- /backend 
- /azure-pipelines.yml → definición del pipeline de CI
- /README.md
- /decisiones.md
- /Evidencia.pdf

---

## Diseño del pipeline
- **Trigger:** en cada push a la rama `main`.
- **Pool:** `Pauli` (agente self-hosted `PAU`).
- **Stages:**
  1. **Build_Front**
     - Instala dependencias (`npm install`).
     - Compila la app React (`npm run build`).
     - Publica artefacto `drop-front` con los archivos estáticos.
  2. **Build_Back**
     - Instala dependencias (`npm install`).
     - Corre los tests (`npm test`).
     - Publica artefacto `drop-back`.

---

## Evidencias
### Agente Self-Hosted
- Captura de la creación del pool `Pauli` y el agente `PAU` registrado como servicio.

### Ejecución de pipeline
- Logs del stage **Build_Front** mostrando instalación de dependencias y ejecución del build.
- Logs del stage **Build_Back** con ejecución de tests.
- Artefactos publicados (`drop-front`, `drop-back`).

---

## URL
- Proyecto en Azure DevOps: [https://dev.azure.com/paulinaortiz/TP4]

