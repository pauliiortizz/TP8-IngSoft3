# 📋 Decisiones Técnicas - TP8 Ingeniería de Software 3

## 1. Container Registry: GitHub Container Registry (GHCR)

### ✅ Elección: GitHub Container Registry

**Justificación:**

#### Ventajas de GHCR:
- ✅ **Costo**: Completamente gratuito para repositorios públicos
- ✅ **Integración nativa**: Se integra perfectamente con GitHub Actions sin configuración adicional
- ✅ **Autenticación simplificada**: Usa `GITHUB_TOKEN` o PAT sin necesidad de gestionar credenciales externas
- ✅ **Visibilidad**: Packages vinculados directamente al repositorio
- ✅ **Versionado automático**: Tags basados en SHA, run number, y nombres personalizados
- ✅ **Seguridad**: Escaneo de vulnerabilidades integrado
- ✅ **Ancho de banda**: Sin límites para repositorios públicos

#### Comparación con alternativas:

| Característica | GHCR | Docker Hub | Azure ACR | AWS ECR |
|----------------|------|------------|-----------|---------|
| **Costo** | ✅ Gratis | ⚠️ 1 repo privado gratis | ❌ ~$5/mes | ❌ ~$0.10/GB |
| **Integración GitHub** | ✅ Nativa | ⚠️ Requiere config | ⚠️ Requiere config | ⚠️ Requiere config |
| **Autenticación** | ✅ Token automático | ❌ Username/password | ❌ Service principal | ❌ IAM roles |
| **Velocidad Push/Pull** | ✅ Muy rápido | ⚠️ Rate limits | ✅ Rápido | ✅ Rápido |
| **Setup complexity** | ✅ Simple | ⚠️ Medio | ❌ Complejo | ❌ Complejo |

**Desventajas de GHCR:**
- ⚠️ Menos conocido que Docker Hub
- ⚠️ Requiere GitHub como plataforma principal
- ⚠️ Menor madurez que Docker Hub

**Decisión final:** GHCR es la mejor opción para este proyecto porque:
1. El código ya está en GitHub
2. Usamos GitHub Actions como CI/CD
3. Es gratuito y sin límites
4. La integración es trivial (solo `packages: write` permission)

---

## 2. Servicio de Deploy para QA: Render.com

### ✅ Elección: Render.com

**Justificación:**

#### Ventajas de Render.com:
- ✅ **Tier gratuito generoso**: 750 horas/mes por servicio
- ✅ **Deploy automático desde GHCR**: Soporte nativo para container registries
- ✅ **Configuración simple**: Variables de entorno vía UI o deploy hooks
- ✅ **Deploy hooks**: Webhooks para CI/CD automático
- ✅ **SSL automático**: HTTPS habilitado por defecto
- ✅ **Logs en tiempo real**: Accesibles desde dashboard
- ✅ **Sin configuración de infraestructura**: Totalmente managed

#### Comparación con alternativas:

| Característica | Render.com | Azure Container Instances | AWS App Runner | Fly.io |
|----------------|------------|---------------------------|----------------|--------|
| **Costo** | ✅ Gratis (con límites) | ❌ ~$30/mes | ❌ ~$5/mes | ✅ Gratis (con límites) |
| **Setup** | ✅ Muy simple | ⚠️ Complejo | ⚠️ Medio | ⚠️ CLI required |
| **Deploy desde GHCR** | ✅ Nativo | ✅ Soportado | ✅ Soportado | ✅ Soportado |
| **Webhooks CI/CD** | ✅ Sí | ❌ No nativo | ⚠️ Limitado | ⚠️ Limitado |
| **SSL automático** | ✅ Sí | ⚠️ Manual | ✅ Sí | ✅ Sí |

**Configuración específica para QA:**
- **Image**: `ghcr.io/pauliiortizz/productosapi:qa`
- **Environment**: `ASPNETCORE_ENVIRONMENT=QA`
- **MongoDB**: Cluster separado para QA (`mydb.f5i4ecj.mongodb.net/MyDB`)
- **Recursos**: Plan Free (512MB RAM, 0.1 CPU)
- **Auto-deploy**: Deshabilitado (deploy via webhook desde GitHub Actions)

**Decisión final:** Render.com es ideal para QA porque:
1. Gratis y sin requerir tarjeta de crédito
2. Deploy hooks permiten integración perfecta con GitHub Actions
3. Configuración visual simple para equipo de testing
4. Logs accesibles sin CLI

---

## 3. Servicio de Deploy para PROD: Render.com

### ✅ Elección: Mismo servicio (Render.com) pero con configuración diferente

**Justificación para usar el mismo servicio:**

#### Ventajas de consistencia:
- ✅ **Paridad de entornos**: Mismo runtime behavior en QA y PROD
- ✅ **Menor curva de aprendizaje**: Un solo servicio que dominar
- ✅ **Simplificación del pipeline**: Misma estrategia de deploy
- ✅ **Debugging más fácil**: Si funciona en QA, funciona en PROD
- ✅ **Costos predecibles**: Misma estructura de pricing

**Diferencias de configuración QA vs PROD:**

| Aspecto | QA | PROD |
|---------|----|----|
| **Imagen Docker** | `ghcr.io/.../productosapi:qa` | `ghcr.io/.../productosapi:prod` |
| **Variable de entorno** | `ASPNETCORE_ENVIRONMENT=QA` | `ASPNETCORE_ENVIRONMENT=Production` |
| **MongoDB** | `mydb.f5i4ecj.mongodb.net/MyDB` | `mydb-prod.sd3fnuw.mongodb.net/MyDB-PROD` |
| **Deploy Hook** | `RENDER_DEPLOY_HOOK_QA` | `RENDER_DEPLOY_HOOK_PROD` |
| **URL** | `https://...-qa.onrender.com` | `https://...-prod.onrender.com` |
| **Deploy automático** | ✅ Inmediato tras build | ⏸️ Requiere aprobación manual |
| **Appsettings** | `appsettings.QA.json` | `appsettings.Production.json` |
| **Health checks** | Validación post-deploy | Validación post-deploy + notificación |

**Estrategia de segregación:**
1. **Bases de datos separadas**: Clusters MongoDB completamente independientes
2. **Imágenes Docker separadas**: Tags `qa` y `prod` con configuraciones diferentes
3. **Deploy hooks separados**: Webhooks diferentes para cada ambiente
4. **Aprobación manual para PROD**: Quality gate en GitHub Actions

**Posible escalamiento futuro:**
Si el proyecto crece, PROD podría moverse a:
- **Azure Container Apps**: Autoescalado horizontal, mayor disponibilidad
- **AWS App Runner**: Global deployment, CDN integrado
- **Google Cloud Run**: Serverless scaling, mejor pricing para tráfico variable

**Decisión final:** Usar Render.com para ambos ambientes porque:
1. Simplifica el desarrollo y mantenimiento del pipeline
2. Garantiza paridad entre QA y PROD
3. La segregación se logra mediante configuración, no infraestructura diferente
4. Es suficiente para la escala actual del proyecto

---

## 4. Pipeline CI/CD: GitHub Actions

### ✅ Flujo completo implementado

```
┌─────────────────────────────────────────────────────────────┐
│                    TRIGGER: Push to master                   │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  STAGE 1: Build & Test                                       │
│  ├─ Setup .NET 8                                            │
│  ├─ Restore dependencies (Backend + Tests)                  │
│  ├─ Build Backend                                           │
│  ├─ Build Backend Tests                                     │
│  ├─ Run Backend Tests ✅                                    │
│  ├─ Setup Node.js                                           │
│  ├─ Build Frontend (Angular)                                │
│  ├─ Run Frontend Tests ✅                                   │
│  ├─ Copy Frontend to Backend/wwwroot                        │
│  └─ Upload combined artifacts                               │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  STAGE 2: Docker Build & Push (Matrix: qa, prod)           │
│  ├─ Download artifacts                                      │
│  ├─ Login to GHCR (PAT authentication)                      │
│  ├─ Build Docker image (Dockerfile.qa / Dockerfile.prod)    │
│  ├─ Tag: {env}, {env}-{run_number}, {env}-{sha}           │
│  └─ Push to ghcr.io/pauliiortizz/productosapi              │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  STAGE 3: Deploy to QA                                      │
│  ├─ Trigger Render webhook (RENDER_DEPLOY_HOOK_QA)          │
│  ├─ Wait 30 seconds                                         │
│  ├─ Health check: /health endpoint ✅                      │
│  └─ Verify admin page: /admin.html ✅                      │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  STAGE 4: Deploy to PROD                                    │
│  ├─ ⏸️  WAIT FOR MANUAL APPROVAL (Environment: Production) │
│  ├─ Trigger Render webhook (RENDER_DEPLOY_HOOK_PROD)        │
│  ├─ Wait 30 seconds                                         │
│  ├─ Health check: /health endpoint ✅                      │
│  ├─ Verify admin page: /admin.html ✅                      │
│  └─ Notify success 🎉                                       │
└─────────────────────────────────────────────────────────────┘
```

### Quality Gates implementados:

1. ✅ **Tests obligatorios**: Backend y Frontend tests deben pasar antes de build
2. ✅ **Build exitoso**: Artifacts solo se generan si tests pasan
3. ✅ **Docker build exitoso**: Imágenes solo se pushean si el build funciona
4. ✅ **Health checks post-deploy**: Verificación automática de endpoints
5. ⚠️ **Aprobación manual para PROD**: Requiere configurar Environment "Production"

### Versionado de imágenes:

Cada push genera **3 tags** por ambiente:
- `qa` / `prod` (latest)
- `qa-6` / `prod-6` (run number para rollback)
- `qa-91ded66` / `prod-91ded66` (commit SHA para trazabilidad)

### Configuración de secretos y variables:

**Secrets:**
- `GHCR_TOKEN`: Personal Access Token con `write:packages`
- `RENDER_DEPLOY_HOOK_QA`: Webhook para deploy automático a QA
- `RENDER_DEPLOY_HOOK_PROD`: Webhook para deploy automático a PROD

**Variables:**
- `QA_URL`: URL pública del servicio QA
- `PROD_URL`: URL pública del servicio PROD

**Permissions:**
```yaml
permissions:
  contents: read      # Leer código del repositorio
  packages: write     # Escribir imágenes en GHCR
```

---

## 📊 Resumen de Decisiones

| Categoría | Decisión | Justificación Principal |
|-----------|----------|------------------------|
| **Container Registry** | GHCR | Integración nativa con GitHub + Gratis |
| **Deploy QA** | Render.com | Simple, gratis, webhooks nativos |
| **Deploy PROD** | Render.com | Paridad con QA, configuración diferenciada |
| **CI/CD** | GitHub Actions | Integración completa con GHCR + Environments |
| **Base de datos QA** | MongoDB Atlas (cluster QA) | Separación de datos de testing |
| **Base de datos PROD** | MongoDB Atlas (cluster PROD) | Aislamiento total de producción |
| **Dockerfiles** | Single-stage simplificados | Build lo hace GitHub Actions, no Docker |
| **Aprobación PROD** | GitHub Environments | Quality gate obligatorio antes de deploy |

---

## ✅ Checklist de Implementación

- [x] Container Registry configurado (GHCR)
- [x] Pipeline CI/CD completo en GitHub Actions
- [x] Build y test automatizados (Backend + Frontend)
- [x] Imágenes Docker optimizadas
- [x] Push a GHCR con versionado
- [x] Deploy automático a QA
- [x] Deploy a PROD con webhook
- [ ] **Aprobación manual para PROD** ⚠️ (Falta configurar Environment)
- [x] Health checks post-deploy
- [x] MongoDB segregado por ambiente
- [x] Variables de entorno por ambiente
- [x] Documentación de decisiones técnicas

---

**Fecha de documentación**: 9 de Noviembre, 2025  
**Autor**: Paula Ortiz  
**Proyecto**: TP8 - Ingeniería de Software 3
