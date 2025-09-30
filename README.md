# TP4 - Ortiz, Salinas

## Descripción
Este proyecto es un **mono-repo** con una aplicación mínima compuesta por:
- **Frontend:** React (`/frontend`)
- **Backend:** Node.js con Express (`/backend`)

El pipeline de CI está configurado en Azure DevOps con un **agente self-hosted** instalado localmente.

---

## Requisitos previos

### Local
- Node.js 18.x
- npm 9.x
- Git

### Para el agente self-hosted
- Acceso a Azure DevOps
- Agente instalado en la PC y registrado en el pool `Pauli`
- Conectividad a Internet

---

## Ejecución local

### Frontend
```bash
cd frontend
npm install
npm start
``` 

### Backend
```bash
cd backend
npm install
npm start
```

