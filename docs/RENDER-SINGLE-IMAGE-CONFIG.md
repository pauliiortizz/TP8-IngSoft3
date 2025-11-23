# 🚀 Configuración de Render con Imagen Docker Única

## 📋 Resumen

Este proyecto ahora utiliza **una sola imagen Docker** para todos los ambientes (QA y Production). La configuración del ambiente se realiza mediante **variables de entorno en runtime**.

### ✅ Ventajas de este enfoque:
- ✅ Una sola imagen = menos espacio en GitHub Packages
- ✅ Build más rápido (se construye una sola vez)
- ✅ **Misma imagen en QA y PROD** = mayor consistencia
- ✅ Cumple con el principio "Build Once, Deploy Everywhere"

---

## 🐳 La Imagen Docker

**Ubicación en GitHub Container Registry:**
```
ghcr.io/pauliiortizz/productosapi
```

**Tags disponibles:**
- `latest` - Última versión construida
- `qa` - Tag específico para QA (misma imagen que latest)
- `prod` - Tag específico para PROD (misma imagen que latest)
- `<commit-sha>` - Tag con el hash del commit específico

---

## ⚙️ Configuración en Render

### 🟡 Servicio QA

#### 1. Información Básica
- **Name:** `productosapi-qa`
- **Region:** Oregon (US West)
- **Instance Type:** Free o el que prefieras

#### 2. Image
```
ghcr.io/pauliiortizz/productosapi:latest
```
O puedes usar el tag específico:
```
ghcr.io/pauliiortizz/productosapi:qa
```

#### 3. Variables de Entorno (Environment Variables)

| Variable | Valor | Descripción |
|----------|-------|-------------|
| `ASPNETCORE_ENVIRONMENT` | `QA` | **Crítico:** Define que se use appsettings.QA.json |
| `ConnectionStrings__MongoDb` | `<tu-mongo-qa>` | Connection string de MongoDB para QA |
| `ASPNETCORE_URLS` | `http://+:80` | URLs donde escucha la app |

**Ejemplo completo:**
```bash
ASPNETCORE_ENVIRONMENT=QA
ConnectionStrings__MongoDb=mongodb+srv://user:pass@cluster.mongodb.net/productosdb-qa
ASPNETCORE_URLS=http://+:80
```

#### 4. Health Check (Opcional pero recomendado)
- **Path:** `/health`
- **Initial Delay:** 30 segundos

---

### 🔴 Servicio PRODUCTION

#### 1. Información Básica
- **Name:** `productosapi-prod`
- **Region:** Oregon (US West)
- **Instance Type:** Starter o superior (no Free para producción)

#### 2. Image
```
ghcr.io/pauliiortizz/productosapi:latest
```
O puedes usar el tag específico:
```
ghcr.io/pauliiortizz/productosapi:prod
```

#### 3. Variables de Entorno (Environment Variables)

| Variable | Valor | Descripción |
|----------|-------|-------------|
| `ASPNETCORE_ENVIRONMENT` | `Production` | **Crítico:** Define que se use appsettings.Production.json |
| `ConnectionStrings__MongoDb` | `<tu-mongo-prod>` | Connection string de MongoDB para PROD |
| `ASPNETCORE_URLS` | `http://+:80` | URLs donde escucha la app |

**Ejemplo completo:**
```bash
ASPNETCORE_ENVIRONMENT=Production
ConnectionStrings__MongoDb=mongodb+srv://user:pass@cluster.mongodb.net/productosdb-prod
ASPNETCORE_URLS=http://+:80
```

#### 4. Health Check (Opcional pero recomendado)
- **Path:** `/health`
- **Initial Delay:** 30 segundos

---

## 🔐 Autenticación con GitHub Packages

Para que Render pueda descargar la imagen de GitHub Container Registry:

### Opción 1: Imagen Pública (Recomendado para este proyecto)
1. Ve a GitHub → Packages → `productosapi`
2. Click en "Package settings"
3. Scroll hasta "Danger Zone"
4. Click en "Change visibility" → **Make Public**
5. Confirma

✅ **Con esto, Render puede descargar la imagen sin credenciales**

### Opción 2: Imagen Privada (Requiere credenciales)
Si prefieres mantener la imagen privada:

1. Crea un GitHub Personal Access Token (PAT):
   - GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Genera nuevo token con permisos: `read:packages`
   
2. En Render, en cada servicio, agrega estas variables de entorno adicionales:
   ```
   DOCKER_USERNAME=pauliiortizz
   DOCKER_PASSWORD=<tu-github-pat>
   ```

---

## 🔄 Proceso de Deployment

### 1️⃣ Flujo Automático (CI/CD)

```
Push a master/main
      ↓
Azure Pipeline corre
      ↓
BuildAndTest stage
  - Tests
  - Build
  - SonarCloud
      ↓
BuildDockerImage stage
  - Construye imagen única
  - Tagea: latest, qa, prod, <commit-sha>
  - Sube a ghcr.io
      ↓
Deploy_QA stage
  - Despliega a Azure (si lo usas)
      ↓
Deploy_PROD stage
  - Despliega a Azure (si lo usas)
```

### 2️⃣ Render Auto-Deploy

En cada servicio de Render:
- **Auto-Deploy:** Enable
- **Image Path:** `ghcr.io/pauliiortizz/productosapi:latest`

Render automáticamente detectará cuando se publique una nueva imagen y redesplegará.

---

## 📊 Verificación

### Verificar que la imagen es la misma:

```bash
# Ver el digest (hash) de la imagen en QA
docker pull ghcr.io/pauliiortizz/productosapi:qa
docker images --digests | grep productosapi

# Ver el digest de la imagen en PROD
docker pull ghcr.io/pauliiortizz/productosapi:prod
docker images --digests | grep productosapi
```

**Los digests deben ser idénticos** ✅

### Verificar el ambiente en runtime:

**En QA:**
```bash
curl https://productosapi-qa.onrender.com/health
# O visita desde el navegador
```

**En PROD:**
```bash
curl https://productosapi-prod.onrender.com/health
# O visita desde el navegador
```

Los logs de cada servicio mostrarán:
```
QA: Now listening on: http://[::]:80
QA: Application started. Environment: QA

PROD: Now listening on: http://[::]:80
PROD: Application started. Environment: Production
```

---

## 🆘 Troubleshooting

### Problema: Render no puede descargar la imagen
**Solución:** Verifica que la imagen sea pública o que tengas las credenciales correctas.

### Problema: La app usa el ambiente incorrecto
**Solución:** Revisa que `ASPNETCORE_ENVIRONMENT` esté correctamente configurado en las variables de entorno de Render.

### Problema: Error al conectar a MongoDB
**Solución:** Verifica que `ConnectionStrings__MongoDb` esté correctamente configurado (nota los dos guiones bajos `__`).

### Problema: La imagen no se actualiza en Render
**Solución:** 
1. Verifica que el pipeline haya subido la imagen exitosamente
2. En Render, haz "Manual Deploy" para forzar la actualización
3. Verifica que estés usando el tag correcto (`:latest` se actualiza automáticamente)

---

## 📚 Referencias

- [Azure Pipeline](../azure-pipelines-merged.yml) - Pipeline CI/CD
- [Dockerfile](../Backend/Dockerfile) - Dockerfile único
- [Render Docs](https://render.com/docs/docker)
- [GitHub Packages Docs](https://docs.github.com/en/packages)

---

## 🎓 Para el Profesor

Este proyecto implementa el principio **"Build Once, Deploy Everywhere"**:

1. ✅ **Una sola imagen Docker** se construye en el pipeline
2. ✅ La imagen se **tagea múltiples veces** (latest, qa, prod, commit-sha) pero todas apuntan a la misma imagen
3. ✅ La diferencia entre ambientes se configura en **runtime mediante variables de entorno**
4. ✅ Esto garantiza **consistencia** entre QA y Producción
5. ✅ Reduce el tiempo de build y el espacio de almacenamiento

**Beneficio clave:** Si la aplicación funciona en QA, funcionará exactamente igual en PROD porque usan la misma imagen.
