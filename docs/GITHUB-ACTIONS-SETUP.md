# 🚀 Configuración de GitHub Actions Pipeline

## 📋 Prerequisitos

- ✅ Repositorio en GitHub: `pauliiortizz/TP8-IngSoft3`
- ✅ Imágenes en GHCR: `ghcr.io/pauliiortizz/productosapi:qa` y `prod`
- ✅ Web Services en Render funcionando

---

## 🔧 Configuración Paso a Paso

### **Paso 1: Configurar Secrets en GitHub (5 min)**

1. Ve a tu repositorio en GitHub
2. **Settings** → **Secrets and variables** → **Actions**
3. Click en **"New repository secret"**

#### Secrets a crear:

| Secret Name | Valor | Descripción |
|------------|-------|-------------|
| `RENDER_DEPLOY_HOOK_QA` | URL del webhook de Render QA | Deploy hook de tu servicio QA |
| `RENDER_DEPLOY_HOOK_PROD` | URL del webhook de Render PROD | Deploy hook de tu servicio PROD |

**¿Cómo obtener los Deploy Hooks de Render?**

Para cada Web Service en Render:
1. Ve a tu servicio (QA o PROD)
2. **Settings** → **Deploy Hook**
3. Copia la URL que empieza con: `https://api.render.com/deploy/srv-...`

---

### **Paso 2: Configurar Variables en GitHub (2 min)**

1. **Settings** → **Secrets and variables** → **Actions** → Tab **"Variables"**
2. Click en **"New repository variable"**

#### Variables a crear:

| Variable Name | Valor | Descripción |
|--------------|-------|-------------|
| `QA_URL` | URL de tu servicio QA | `https://tu-servicio-qa.onrender.com` |
| `PROD_URL` | URL de tu servicio PROD | `https://tu-servicio-prod.onrender.com` |

---

### **Paso 3: Configurar Environments en GitHub (5 min)**

Esto permite aprobaciones manuales antes de desplegar a producción.

#### Crear Environment QA:

1. **Settings** → **Environments** → **"New environment"**
2. Name: `QA`
3. **Configure environment**
4. (Opcional) Agregar **Protection rules** si quieres:
   - Required reviewers (para aprobación manual)
   - Wait timer (espera antes de deploy)
5. Click **"Save protection rules"**

#### Crear Environment Production:

1. **Settings** → **Environments** → **"New environment"**
2. Name: `Production`
3. **Configure environment**
4. **Protection rules** (IMPORTANTE para PROD):
   - ✅ **Required reviewers**: Agrégarte a ti mismo
   - ✅ **Wait timer**: 5 minutos (opcional)
5. Click **"Save protection rules"**

Esto hará que el pipeline **espere tu aprobación manual** antes de desplegar a producción.

---

### **Paso 4: Verificar Permisos de GITHUB_TOKEN (1 min)**

1. **Settings** → **Actions** → **General**
2. Scroll hasta **"Workflow permissions"**
3. Seleccionar: **"Read and write permissions"**
4. ✅ Tildar: **"Allow GitHub Actions to create and approve pull requests"**
5. Click **"Save"**

---

### **Paso 5: Ajustar Dockerfile Paths (2 min)**

Los Dockerfiles deben estar accesibles desde el contexto de build. Asegurate que:

```
Backend/
  ├── Dockerfile.qa
  ├── Dockerfile.prod
  └── Backend/
      └── ProductosApi.csproj
```

Si tus Dockerfiles usan rutas relativas diferentes, ajusta el workflow.

---

### **Paso 6: Push y Ejecutar Pipeline (1 min)**

1. Commitea y pushea el workflow a GitHub:

```bash
git add .github/workflows/ci-cd-pipeline.yml
git commit -m "Add GitHub Actions CI/CD pipeline"
git push origin master
```

2. Ve a GitHub → **Actions** tab
3. Deberías ver el workflow ejecutándose automáticamente

---

## 🎯 Flujo del Pipeline

### **Stage 1: Build & Test** (5-10 min)
- ✅ Build Backend (.NET 8)
- ✅ Run Backend Tests
- ✅ Build Frontend (Angular)
- ✅ Run Frontend Tests
- ✅ Combine Backend + Frontend
- ✅ Upload artifacts

### **Stage 2: Docker Build & Push** (5 min)
- ✅ Download artifacts
- ✅ Build imagen QA → `ghcr.io/pauliiortizz/productosapi:qa`
- ✅ Build imagen PROD → `ghcr.io/pauliiortizz/productosapi:prod`
- ✅ Push ambas imágenes a GHCR
- ✅ Tags: `qa`, `qa-123`, `prod`, `prod-123`, `latest`

### **Stage 3: Deploy QA** (2 min)
- ✅ Trigger Render deploy (webhook)
- ✅ Wait 30 seconds
- ✅ Verify health check
- ✅ Verify admin.html

### **Stage 4: Deploy PROD** (Manual Approval Required)
- ⏸️ **ESPERA APROBACIÓN MANUAL** (si configuraste protection rules)
- ✅ Trigger Render deploy (webhook)
- ✅ Wait 30 seconds
- ✅ Verify health check
- ✅ Verify admin.html
- ✅ Notify success

---

## 🔍 Verificación

### Después del primer push:

1. **GitHub Actions** tab → Ver workflow ejecutándose
2. **Build & Test** debe completarse exitosamente
3. **Docker Build** debe mostrar 2 imágenes construidas (QA y PROD)
4. **Deploy QA** debe ejecutarse automáticamente
5. **Deploy PROD** debe estar esperando tu aprobación

### Aprobar Deploy a PROD:

1. En la ejecución del workflow, verás **"Review deployments"**
2. Click en **"Review deployments"**
3. Seleccionar **"Production"**
4. Click **"Approve and deploy"**

---

## 🎨 Personalización (Opcional)

### Agregar notificaciones:

```yaml
- name: Notify Slack
  if: success()
  run: |
    curl -X POST ${{ secrets.SLACK_WEBHOOK }} \
      -H 'Content-Type: application/json' \
      -d '{"text":"✅ Deploy to PROD successful!"}'
```

### Ejecutar solo en ciertos branches:

```yaml
on:
  push:
    branches: [ main, develop ]
```

### Agregar más tests:

```yaml
- name: Run Integration Tests
  run: npm run test:integration
  working-directory: Frontend
```

---

## 🐛 Troubleshooting

### Error: "Permission denied to push to GHCR"
**Solución:** Verificar que **Workflow permissions** tenga "Read and write"

### Error: "Dockerfile not found"
**Solución:** Verificar paths en el workflow y estructura de carpetas

### Error: "Render webhook failed"
**Solución:** 
- Verificar que los secrets RENDER_DEPLOY_HOOK_* estén correctos
- Probar el webhook manualmente con curl

### Deploy queda esperando indefinidamente
**Solución:** Revisar logs de Render para ver si hay errores en el deploy

---

## 📊 Comparación: GitHub Actions vs Azure DevOps

| Característica | GitHub Actions | Azure DevOps |
|----------------|----------------|--------------|
| **Costo** | ✅ Gratis (2000 min/mes) | ✅ Gratis (1800 min/mes) |
| **Configuración** | ⭐⭐⭐⭐⭐ Simple (YAML) | ⭐⭐⭐ Más complejo |
| **Integración GHCR** | ⭐⭐⭐⭐⭐ Nativa | ⭐⭐⭐ Requiere config |
| **Approval Gates** | ✅ Environments | ✅ Environments |
| **Marketplace** | ✅ 18,000+ actions | ✅ 1,500+ tasks |
| **Velocidad** | ⭐⭐⭐⭐ Rápido | ⭐⭐⭐ Depende del agent |

---

## ✅ Checklist Final

- [ ] Secrets configurados (RENDER_DEPLOY_HOOK_QA y PROD)
- [ ] Variables configuradas (QA_URL y PROD_URL)
- [ ] Environments creados (QA y Production)
- [ ] Protection rules configuradas en Production
- [ ] Workflow permissions en "Read and write"
- [ ] Workflow pusheado a GitHub
- [ ] Pipeline ejecutándose exitosamente
- [ ] Imágenes en GHCR actualizadas
- [ ] QA desplegado automáticamente
- [ ] PROD esperando aprobación manual

---

**¡Listo!** Tu pipeline de GitHub Actions está configurado 🚀

**Próximo paso:** Push el workflow y ver la magia ocurrir en la tab Actions de GitHub.
