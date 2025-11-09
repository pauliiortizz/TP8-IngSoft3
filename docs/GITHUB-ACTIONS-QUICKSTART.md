# ⚡ Quick Start - GitHub Actions Pipeline

## 🎯 Pasos Inmediatos (15 minutos)

### **1. Configurar Secrets en GitHub (5 min)**

```
GitHub Repo → Settings → Secrets and variables → Actions → New secret
```

**Crear estos 2 secrets:**

| Secret | ¿Dónde obtenerlo? |
|--------|-------------------|
| `RENDER_DEPLOY_HOOK_QA` | Render → Tu servicio QA → Settings → Deploy Hook |
| `RENDER_DEPLOY_HOOK_PROD` | Render → Tu servicio PROD → Settings → Deploy Hook |

Ejemplo de Deploy Hook:
```
https://api.render.com/deploy/srv-xxxxxxxxx?key=yyyyyyyy
```

---

### **2. Configurar Variables en GitHub (2 min)**

```
GitHub Repo → Settings → Secrets and variables → Actions → Variables tab → New variable
```

**Crear estas 2 variables:**

| Variable | Valor |
|----------|-------|
| `QA_URL` | `https://tu-servicio-qa.onrender.com` |
| `PROD_URL` | `https://tu-servicio-prod.onrender.com` |

---

### **3. Crear Environments en GitHub (5 min)**

```
GitHub Repo → Settings → Environments
```

**Crear 2 environments:**

#### Environment: `QA`
- Sin protection rules (deploy automático)

#### Environment: `Production`
- ✅ **Required reviewers**: Agrégarte a ti mismo
- Esto requiere **aprobación manual** antes de deploy a PROD

---

### **4. Configurar Permisos (1 min)**

```
GitHub Repo → Settings → Actions → General → Workflow permissions
```

- Seleccionar: **"Read and write permissions"**
- ✅ Tildar: **"Allow GitHub Actions to create and approve pull requests"**
- Click **"Save"**

---

### **5. Push el Workflow (2 min)**

```bash
cd c:\Users\BANGHO\TP6
git add .github/workflows/ci-cd-pipeline.yml
git commit -m "Add GitHub Actions CI/CD pipeline with GHCR"
git push origin master
```

---

### **6. Ver el Pipeline Ejecutarse**

1. Ve a: https://github.com/pauliiortizz/TP8-IngSoft3/actions
2. Deberías ver el workflow ejecutándose automáticamente
3. Observa cada stage completarse:
   - ✅ Build & Test
   - ✅ Docker Build & Push (QA y PROD en paralelo)
   - ✅ Deploy QA (automático)
   - ⏸️ Deploy PROD (esperando tu aprobación)

---

### **7. Aprobar Deploy a Producción**

Cuando el pipeline llegue a "Deploy to Production":

1. Verás un botón amarillo **"Review deployments"**
2. Click en ese botón
3. Selecciona **"Production"**
4. Escribe un comentario (opcional): "Aprobado para deploy"
5. Click **"Approve and deploy"**

---

## ✅ Verificación

### Después de que todo se ejecute:

**GitHub Packages:**
- [ ] Ve a: https://github.com/pauliiortizz?tab=packages
- [ ] Deberías ver imágenes actualizadas con nuevos tags

**Render QA:**
- [ ] Tu servicio QA se redeployó automáticamente
- [ ] Verifica: `https://tu-qa.onrender.com/admin.html`

**Render PROD:**
- [ ] Tu servicio PROD se redeployó después de tu aprobación
- [ ] Verifica: `https://tu-prod.onrender.com/admin.html`

---

## 🎬 Flujo Visual del Pipeline

```
┌─────────────────────────────────────────────────────────────────┐
│  PUSH to master branch                                          │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
          ┌──────────────────────┐
          │  Build & Test        │
          │  - .NET Backend      │
          │  - Angular Frontend  │
          │  - Combine artifacts │
          └──────────┬───────────┘
                     │
                     ▼
          ┌──────────────────────┐
          │  Docker Build & Push │
          │  ┌─────────┬────────┐│
          │  │ QA      │ PROD   ││
          │  │ Image   │ Image  ││
          │  └─────────┴────────┘│
          │  Push to GHCR        │
          └──────────┬───────────┘
                     │
         ┌───────────┴──────────┐
         │                      │
         ▼                      ▼
   ┌──────────┐         ┌──────────────┐
   │ Deploy   │         │ Deploy PROD  │
   │ QA       │         │ ⏸️  WAITING   │
   │ ✅ AUTO  │         │ FOR APPROVAL │
   └──────────┘         └──────┬───────┘
                               │
                         👤 Manual Review
                               │
                               ▼
                        ┌──────────┐
                        │ Deploy   │
                        │ PROD     │
                        │ ✅ DONE  │
                        └──────────┘
```

---

## 🔥 Tips

### Ejecutar manualmente:
En GitHub Actions tab, click en **"Run workflow"** → **"Run workflow"**

### Ver logs detallados:
Click en cualquier job → Expandir cada step para ver logs

### Re-ejecutar si falla:
Click en **"Re-run all jobs"** o **"Re-run failed jobs"**

### Cancelar ejecución:
Click en **"Cancel workflow"** (útil si algo sale mal)

---

## 📝 Para la Documentación del TP

### Sección: Pipeline CI/CD

**Decisión: GitHub Actions**

```
Elegí GitHub Actions en lugar de Azure DevOps porque:

1. INTEGRACIÓN NATIVA CON GHCR:
   - GITHUB_TOKEN automático (no requiere configurar PAT manualmente)
   - Push a ghcr.io sin service connections
   - Permisos de packages manejados nativamente

2. SIMPLICIDAD:
   - Un solo archivo YAML en .github/workflows/
   - No requiere configurar service connections
   - Matrix strategy para build QA y PROD en paralelo

3. COSTO:
   - 2000 minutos gratis/mes (vs 1800 en Azure DevOps)
   - No requiere self-hosted agents

4. ENVIRONMENTS:
   - Approval gates nativos con "Environments"
   - Protection rules simples de configurar
   - UI clara para aprobar deploys

En un proyecto corporativo con Azure, usaría Azure DevOps por:
- Integración con Azure services
- Azure Boards para gestión de proyecto
- Más control empresarial
```

---

**¡Ahora sí, ejecutá los 7 pasos y tendrás tu pipeline funcionando!** 🚀
