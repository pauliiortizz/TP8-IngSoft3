# 📋 TP8 - Decisiones Técnicas y Documentación de Implementación
 
**Integrantes**: Paulina Ortiz - Delfina Salinas  
**Materia**: Ingeniería de Software 3   
**Repositorio**: [pauliiortizz/TP8-IngSoft3](https://github.com/pauliiortizz/TP8-IngSoft3)

# Sección 1: Decisiones Arquitectónicas y Tecnológicas

## 🛠️ Stack Tecnológico

### **Backend**
- **Lenguaje**: C# / .NET 8
- **Framework**: ASP.NET Core Web API
- **ORM/Database**: MongoDB con MongoDB.Driver
- **Testing**: xUnit + Moq

**Justificación**:
- ✅ **.NET 8**: LTS hasta noviembre 2026, alta performance, multiplataforma
- ✅ **ASP.NET Core**: Framework maduro para APIs REST, soporte nativo para Docker
- ✅ **MongoDB**: Base de datos NoSQL flexible, ideal para desarrollo ágil, Atlas ofrece tier gratuito generoso
- ✅ **xUnit**: Framework de testing estándar en .NET, integración perfecta con CI/CD

### **Frontend**
- **Framework**: Angular 18
- **Lenguaje**: TypeScript
- **Testing**: Karma + Jasmine
- **Styling**: CSS nativo

**Justificación**:
- ✅ **Angular**: Framework enterprise completo, TypeScript nativo, arquitectura escalable
- ✅ **TypeScript**: Tipado estático, menor cantidad de bugs en producción
- ✅ **Karma/Jasmine**: Suite de testing estándar en Angular

### **Infraestructura**
- **Containerización**: Docker
- **Base de datos**: MongoDB Atlas (clusters separados para QA y PROD)
- **Control de versiones**: Git + GitHub

---

## ☁️ Servicios Cloud Elegidos

### 1️⃣ **Container Registry: GitHub Container Registry (GHCR)**

**Decisión**: `ghcr.io`

**Ventajas específicas para este proyecto**:
1. **Integración perfecta**: El código ya está en GitHub, usar GHCR es natural
2. **Cero configuración externa**: No requiere cuentas adicionales en Azure/AWS
3. **Autenticación simplificada**: Un simple PAT con scope `write:packages`
4. **Visibilidad**: Packages aparecen junto al repositorio en GitHub
5. **Gratuito**: Sin límites de storage ni bandwidth para repos públicos

**Configuración implementada**:
- **Repositorio**: `ghcr.io/pauliiortizz/productosapi`
- **Tags por ambiente**: `qa`, `qa-{run_number}`, `qa-{commit_sha}`, `prod`, `prod-{run_number}`, `prod-{commit_sha}`
- **Autenticación**: Personal Access Token con `write:packages` scope
- **Permisos**: Package hereda permisos del repositorio fuente

---

### 2️⃣ **Hosting: Render.com (QA y PROD)**

**Decisión**: Render.com para ambos ambientes

**Ventajas específicas**:
1. **Tier gratuito generoso**: 750 horas/mes por servicio = suficiente para 2 ambientes
2. **Deploy hooks nativos**: Integración perfecta con GitHub Actions mediante webhooks
3. **UI intuitiva**: Ideal para demostración y debugging rápido
4. **Zero downtime deploys**: Render mantiene el servicio anterior hasta que el nuevo responde
5. **Logs accesibles**: No requiere CLI ni comandos complejos
6. **HTTPS automático**: Certificados SSL gestionados automáticamente

### 3️⃣ **CI/CD: GitHub Actions**

**Decisión**: GitHub Actions

**Ventajas específicas**:
1. **Ecosistema unificado**: Código, registry, CI/CD en una sola plataforma (GitHub)
2. **GITHUB_TOKEN automático**: No requiere gestionar credenciales adicionales
3. **Environments nativos**: Approval gates para PROD sin plugins
4. **Matrix builds**: Construcción paralela de imágenes QA y PROD
5. **Marketplace rico**: Actions pre-hechas para Docker, .NET, Node.js

**Pipeline implementado**:
```yaml
Trigger: Push a master
  ↓
Stage 1: Build & Test (5-8 min)
  - Build Backend (.NET 8)
  - Run Backend Tests (xUnit)
  - Build Frontend (Angular)
  - Run Frontend Tests (Karma)
  - Combine artifacts
  ↓
Stage 2: Docker Build & Push (3-5 min)
  - Matrix: [qa, prod]
  - Build 2 imágenes en paralelo
  - Push a GHCR con versionado
  ↓
Stage 3: Deploy QA (1-2 min)
  - Trigger webhook Render
  - Health checks
  ↓
Stage 4: Deploy PROD (Manual approval required)
  - Espera aprobación manual
  - Trigger webhook Render
  - Health checks
  - Notificación de éxito
```

---

## 🔀 Decisión QA vs PROD

### **Estrategia: Mismo servicio, configuración diferenciada**

**Decisión**: Usar Render.com para ambos ambientes con configuración separada

**Justificación**:

#### ✅ **Ventajas de usar el mismo servicio**:

1. **Paridad de entornos (Environment Parity)**:
   - Mismo runtime behavior
   - Mismos comandos para debugging
   - Bugs en QA se comportan igual en PROD

2. **Simplicidad operativa**:
   - Un solo servicio que aprender
   - Misma estrategia de deploy
   - Menor curva de aprendizaje para el equipo

3. **Pipeline unificado**:
   - Mismo código para deploy QA y PROD
   - Reusabilidad del workflow
   - Menos mantenimiento

4. **Costos predecibles**:
   - Misma estructura de pricing
   - Sin sorpresas al escalar

#### 🔧 **Cómo se diferencian los ambientes**:

| Aspecto | QA | PROD |
|---------|----|----|
| **Imagen Docker** | `ghcr.io/.../productosapi:qa` | `ghcr.io/.../productosapi:prod` |
| **Variable de entorno** | `ASPNETCORE_ENVIRONMENT=QA` | `ASPNETCORE_ENVIRONMENT=Production` |
| **Base de datos** | MongoDB Atlas Cluster QA<br>`mydb.f5i4ecj.mongodb.net/MyDB` | MongoDB Atlas Cluster PROD<br>`mydb-prod.sd3fnuw.mongodb.net/MyDB-PROD` |
| **Archivo de configuración** | `appsettings.QA.json` | `appsettings.Production.json` |
| **Deploy hook** | `RENDER_DEPLOY_HOOK_QA` | `RENDER_DEPLOY_HOOK_PROD` |
| **URL pública** | `https://productosapi-qa-1.onrender.com` | `https://productosapi-prod-1.onrender.com` |
| **Deploy automático** | ✅ Inmediato tras build | ⏸️ Requiere aprobación manual |
| **Health checks** | ✅ Verificación básica | ✅ Verificación + notificación |

#### 🔐 **Segregación implementada**:

1. **Bases de datos completamente separadas**:
   - Clusters MongoDB diferentes
   - Credenciales diferentes
   - Datos aislados

2. **Imágenes Docker separadas**:
   - Tag `qa` para ambiente de testing
   - Tag `prod` para ambiente productivo
   - Permiten rollback independiente

3. **Deploy hooks separados**:
   - Webhooks diferentes para cada ambiente
   - Deploy independiente

4. **Aprobación manual para PROD**:
   - Environment "Production" en GitHub con required reviewers
   - Quality gate obligatorio

---

## 💻 Configuración de Recursos

### **QA**
```yaml
Servicio: Render.com Web Service
Plan: Free
Recursos:
  - CPU: 0.1 vCPU (shared)
  - RAM: 512 MB
  - Storage: Ephemeral (imagen Docker)
  - Instancias: 1 (no replica)
  - Auto-scaling: No
  - Health checks: /health endpoint
  - Cold start: Sí (~30 segundos inactividad)
```

**Justificación QA**:
- Recursos suficientes para testing funcional
- Cold starts aceptables para ambiente de pruebas
- Sin costos

### **PROD**
```yaml
Servicio: Render.com Web Service
Plan: Free (con opción a escalar)
Recursos:
  - CPU: 0.1 vCPU (shared)
  - RAM: 512 MB
  - Storage: Ephemeral
  - Instancias: 1
  - Auto-scaling: No (por ahora)
  - Health checks: /health + /admin.html
  - Cold start: Sí
```

**Justificación PROD**:
- Configuración inicial conservadora
- Escalable a plan pago si crece tráfico
- Permite validar comportamiento antes de invertir

**Plan de escalamiento futuro**:
```yaml
Si tráfico > 10,000 req/día:
  Plan: Starter ($7/mes)
  CPU: 0.5 vCPU
  RAM: 512 MB
  Instancias: 2+ (con load balancing)
  Auto-scaling: Sí
  Zero downtime deploys: Sí
```

---

# Sección 2: Implementación

## 📦 Container Registry (GHCR)

### **Configuración implementada**

**URL del registry**: `ghcr.io/pauliiortizz/productosapi`

**Autenticación**:
```yaml
# En GitHub Actions
- name: Log in to GitHub Container Registry
  uses: docker/login-action@v3
  with:
    registry: ghcr.io
    username: ${{ github.actor }}
    password: ${{ secrets.GHCR_TOKEN }}
```

**Personal Access Token (PAT)**:
- Scope: `write:packages`, `read:packages`
- Almacenado como secret: `GHCR_TOKEN`
- Expiration: 90 días

**Permisos configurados**:
- Package visibility: Public
- Inherit access from repository: Enabled
- Write access: pauliiortizz (owner)

### **Versionado de imágenes**

Cada push genera **3 tags por ambiente**:
```
ghcr.io/pauliiortizz/productosapi:qa              ← Latest QA
ghcr.io/pauliiortizz/productosapi:qa-7            ← Build number (rollback)
ghcr.io/pauliiortizz/productosapi:qa-c97b742      ← Commit SHA (trazabilidad)

ghcr.io/pauliiortizz/productosapi:prod            ← Latest PROD
ghcr.io/pauliiortizz/productosapi:prod-7          ← Build number
ghcr.io/pauliiortizz/productosapi:prod-c97b742    ← Commit SHA
```

### 📸 **Capturas requeridas**:

- [ ] **Captura 1**: GitHub Packages mostrando el paquete `productosapi`
      <img width="950" height="220" alt="image" src="https://github.com/user-attachments/assets/154c5440-fe0a-41dd-916a-2ea218c0a2e8" />
      
- [ ] **Captura 2**: Lista de tags (qa, qa-X, qa-sha, prod, prod-X, prod-sha)
      <img width="753" height="535" alt="image" src="https://github.com/user-attachments/assets/b7a0d423-a323-4c63-91e0-fbb0ddcec65d" />

- [ ] **Captura 3**: Detalles de una imagen (tamaño, layers, fecha)
      <img width="816" height="364" alt="image" src="https://github.com/user-attachments/assets/199e9f47-6043-4a73-a858-602af5716dbd" />

- [ ] **Captura 4**: Package settings mostrando permisos y visibilidad
      <img width="1093" height="286" alt="image" src="https://github.com/user-attachments/assets/24b1d53e-b3f5-4e0e-8196-0351d3070970" />

- [ ] **Captura 5**: GitHub Actions log mostrando push exitoso a GHCR

---

## 🧪 Ambiente QA

### **Configuración del servicio**

**Plataforma**: Render.com  
**Tipo**: Web Service  
**URL**: `https://productosapi-qa-1.onrender.com`

**Configuración de imagen**:
```yaml
Image URL: ghcr.io/pauliiortizz/productosapi:qa
Pull Policy: Always (actualiza en cada deploy)
Registry: GitHub Container Registry
Authentication: Read access via GHCR (público)
```

**Variables de entorno configuradas**:
```bash
ASPNETCORE_ENVIRONMENT=QA
ASPNETCORE_URLS=http://+:80
ConnectionStrings__MongoDb=mongodb+srv://pauli:admin@mydb.f5i4ecj.mongodb.net/MyDB
MongoDbSettings__DatabaseName=MyDB
```

**Secretos (no expuestos)**:
- MongoDB connection string con credenciales
- (Agregados directamente en Render Dashboard)

**Recursos**:
- Plan: Free
- RAM: 512MB
- CPU: 0.1 shared vCPU
- Storage: Ephemeral
- Región: Oregon (US West)

**Deploy hook configurado**:
```bash
URL: https://api.render.com/deploy/srv-d48fmqv5r7bs739h2big?key=iUvAXlAdjqw
Configurado como: RENDER_DEPLOY_HOOK_QA (GitHub Secret)
```

### **Verificación del deploy**

**Endpoints disponibles**:
- `/` - Frontend Angular (lista de productos)
- `/admin.html` - API Tester (botones de prueba)
- `/api/Product` - API REST
- `/health` - Health check endpoint

**Health checks configurados**:
```yaml
Health Check Path: /health
Expected Status: 200
Timeout: 30s
Interval: 60s
```

### 📸 **Capturas requeridas**:

- [ ] Render Dashboard mostrando servicio QA "Live"
      <img width="1003" height="477" alt="image" src="https://github.com/user-attachments/assets/24adcf3e-1bd9-428b-8d8c-aab5609e833c" />

- [ ] Variables de entorno configuradas (ocultar secretos)
      <img width="1013" height="447" alt="image" src="https://github.com/user-attachments/assets/22c556fc-9777-4168-a039-49f371b70c64" />

- [ ] Navegador en `https://productosapi-qa-1.onrender.com/` mostrando frontend Angular
      <img width="1365" height="635" alt="image" src="https://github.com/user-attachments/assets/c83e5cbe-21dc-4616-8380-e542aa1793f4" />

- [ ] Navegador en `/admin.html` mostrando API Tester
      <img width="1365" height="569" alt="image" src="https://github.com/user-attachments/assets/3998b45a-c1aa-4d96-90ad-97e5dccb283f" />

- [ ] Response de `/api/Product` mostrando datos de MongoDB QA
      <img width="1362" height="251" alt="image" src="https://github.com/user-attachments/assets/f123ddc6-ce4d-48d2-8133-d34f652a679c" />


---

## 🚀 Ambiente PROD

### **Configuración del servicio**

**Plataforma**: Render.com  
**Tipo**: Web Service  
**URL**: `https://productosapi-prod-1.onrender.com`

**Configuración de imagen**:
```yaml
Image URL: ghcr.io/pauliiortizz/productosapi:prod
Pull Policy: Always
Registry: GitHub Container Registry
Auto-deploy: Via webhook (no automático desde registry)
```

**Variables de entorno configuradas**:
```bash
ASPNETCORE_ENVIRONMENT=Production
ASPNETCORE_URLS=http://+:80
ConnectionStrings__MongoDb=mongodb+srv://pauli:admin@mydb-prod.sd3fnuw.mongodb.net/MyDB-PROD
MongoDbSettings__DatabaseName=MyDB-PROD
```

**Secretos**:
- MongoDB PROD connection string (cluster diferente)
- Credenciales de acceso a base de datos productiva

**Recursos** (idénticos a QA por ahora):
- Plan: Free
- RAM: 512MB
- CPU: 0.1 shared vCPU
- Región: Oregon (US West)

**Deploy hook configurado**:
```bash
URL: https://api.render.com/deploy/srv-d48fo04hg0os7388sdo0?key=oTbaXz_Oj_8
Configurado como: RENDER_DEPLOY_HOOK_PROD (GitHub Secret)
```

### **Continuous Deployment**

**Estrategia implementada**:
```
GitHub Actions (push to master)
    ↓
Build & Test
    ↓
Docker Build & Push (QA + PROD images)
    ↓
Deploy QA (automático)
    ↓
⏸️ ESPERA APROBACIÓN MANUAL
    ↓
Deploy PROD (después de approval)
```

**Approval gate**:
- Environment: "Production" en GitHub
- Required reviewers: pauliiortizz
- Wait timer: Opcional (no configurado)

### **Diferencias clave con QA**

| Aspecto | QA | PROD |
|---------|----|----|
| **Base de datos** | Cluster de testing con datos de prueba | Cluster productivo con datos reales |
| **Deploy** | ✅ Automático tras build | ⏸️ Requiere aprobación manual |
| **Health checks** | Verificación básica | Verificación + notificación |
| **Rollback** | Informal (redeploy) | Formal (cambiar tag de imagen) |
| **Monitoreo** | Logs en Render | Logs + alertas (futuro) |

### **Escalabilidad configurada**

**Actual (Free tier)**:
- 1 instancia
- Sin auto-scaling
- Cold starts posibles

**Plan de escalamiento**:
```yaml
# Si tráfico crece:
Plan: Starter ($7/mes)
Instancias: 2-3 (horizontal scaling)
Auto-scaling: Basado en CPU/memoria
Zero downtime deploys: Sí
Load balancing: Automático por Render
```

### 📸 **Capturas requeridas**:

- [ ] Render Dashboard mostrando servicio PROD "Live"
      <img width="990" height="484" alt="image" src="https://github.com/user-attachments/assets/40438a84-fcaf-43c2-9894-0cb410cf2238" />

- [ ] Variables de entorno PROD (diferentes a QA)
      <img width="1013" height="447" alt="image" src="https://github.com/user-attachments/assets/e4de672e-e42f-471c-8e44-b68c000ea064" />

- [ ] Frontend en PROD funcionando
      <img width="1365" height="642" alt="image" src="https://github.com/user-attachments/assets/044fdf05-dfe6-4c36-a088-f2da3eabe45d" />

- [ ] API Tester en PROD
      <img width="1365" height="624" alt="image" src="https://github.com/user-attachments/assets/b8003984-a268-45db-970e-61291587d4f6" />

- [ ] MongoDB PROD con datos diferentes a QA
      <img width="1365" height="248" alt="image" src="https://github.com/user-attachments/assets/a608a67e-a6dd-4f7f-b4b4-475ba6117eec" />

- [ ] GitHub Environment "Production" con required reviewers configurado
      <img width="832" height="267" alt="image" src="https://github.com/user-attachments/assets/213ab94a-4706-43ed-9f7b-3f9a1fb37ca3" />


---

## 🔄 Pipeline CI/CD

### **Workflow completo: `.github/workflows/ci-cd-pipeline.yml`**

**Trigger**:
```yaml
on:
  push:
    branches: [ main, master ]
  workflow_dispatch:  # Manual trigger
```

### **Stage 1: Build & Test** 

**Backend (.NET 8)**:
```yaml
- Setup .NET 8
- Restore dependencies (Backend + Tests)
- Build Backend (Release)
- Build Backend Tests
- Run Backend Tests (xUnit)
  ✅ ProductControllerUnitTests
```

**Frontend (Angular)**:
```yaml
- Setup Node.js 20
- Install dependencies (npm ci)
- Run Frontend Tests (Karma + ChromeHeadless)
- Build Frontend (production mode)
```

**Combine artifacts**:
```yaml
- Copy Frontend to Backend/wwwroot
- Publish Backend + Frontend combined
- Upload artifacts (./publish)
```

### **Stage 2: Docker Build & Push** 

**Matrix strategy**: `[qa, prod]` (paralelo)

```yaml
Para cada ambiente:
  - Download artifacts
  - Login a GHCR (PAT)
  - Build imagen Docker
    Context: ./publish
    Dockerfile: Backend/Dockerfile.{qa|prod}
  - Tag con 3 variantes
  - Push a ghcr.io
```

### **Stage 3: Deploy QA** 

```yaml
- Trigger webhook Render QA
- Wait 30 segundos
- Health check: /health
- Verify: /admin.html
```

### **Stage 4: Deploy PROD** (Requiere aprobación)

```yaml
Environment: Production (required reviewers)
- ⏸️ Espera aprobación manual
- Trigger webhook Render PROD
- Wait 5 minutos
- Health check: /health
- Verify: /admin.html
- Notify success
```

### 📸 **Capturas requeridas del Pipeline**:
- [ ] Workflow completo expandido con todos los jobs 
      <img width="1352" height="499" alt="Captura de pantalla 2025-11-09 194546" src="https://github.com/user-attachments/assets/1a8383ac-c3d9-4004-8c8f-2ff7a323e7ac" />



