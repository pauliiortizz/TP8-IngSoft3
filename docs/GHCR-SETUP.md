# 📦 Configuración de GitHub Container Registry (GHCR)

## Paso 1: Crear Personal Access Token

1. Ve a GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
   - URL directa: https://github.com/settings/tokens

2. Click en **"Generate new token"** → **"Generate new token (classic)"**

3. Configurar el token:
   - **Note**: `GHCR_TOKEN_TP8` (o el nombre que prefieras)
   - **Expiration**: 90 days (o el que prefieras)
   - **Scopes** (permisos necesarios):
     - ✅ `write:packages` (incluye read, write y delete packages)
     - ✅ `delete:packages` (para eliminar imágenes)
     - ✅ `repo` (si el repo es privado)

4. Click **"Generate token"**

5. **⚠️ IMPORTANTE**: Copia el token inmediatamente (solo se muestra una vez)
   - Formato: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
   - Guárdalo en un lugar seguro (lo necesitarás después)

---

## Paso 2: Autenticación Local con GHCR

### Opción 1: Desde la terminal (para testing local)

```bash
# Login en GHCR
echo "TU_TOKEN_AQUI" | docker login ghcr.io -u TU_USUARIO_GITHUB --password-stdin
```

### Opción 2: Docker Desktop (recomendado para desarrollo)

1. Docker Desktop → Settings → Docker Engine
2. Agregar al JSON:
```json
{
  "auths": {
    "ghcr.io": {}
  }
}
```

---

## Paso 3: Configurar Permisos de Paquetes en GitHub

### 3.1 Hacer el paquete público (recomendado para el TP)

Una vez que publiques tu primera imagen:

1. Ve a tu perfil de GitHub → Packages
2. Click en tu paquete (ej: `productosapi`)
3. Package settings → Danger Zone → Change visibility → **Public**

### 3.2 Permisos de repositorio (importante)

En la misma página de Package settings:

1. Sección **"Manage Actions access"**
2. Click **"Add Repository"**
3. Seleccionar tu repo: `pauliiortizz/TP8-IngSoft3`
4. Dar permiso: **"Write"** (para que el pipeline pueda push)

---

## Paso 4: Naming Convention en GHCR

Las imágenes en GHCR siguen este formato:

```
ghcr.io/<USUARIO_GITHUB>/<NOMBRE_IMAGEN>:<TAG>
```

**Para tu caso:**
```
ghcr.io/pauliiortizz/productosapi:qa
ghcr.io/pauliiortizz/productosapi:prod
```

**Mejores prácticas de tags:**
- ✅ `qa` - Para ambiente QA
- ✅ `prod` - Para ambiente Producción
- ✅ `v1.0.0` - Versión semántica
- ✅ `latest` - Última versión
- ✅ `main-abc123` - Commit específico
- ❌ Evitar solo `latest` en producción

---

## Paso 5: Testing Local (Opcional)

### Construir y publicar imagen de prueba manualmente:

```bash
# 1. Login
echo "TU_TOKEN" | docker login ghcr.io -u pauliiortizz --password-stdin

# 2. Build con tag de GHCR
docker build -f Backend/Dockerfile.qa -t ghcr.io/pauliiortizz/productosapi:qa .

# 3. Push a GHCR
docker push ghcr.io/pauliiortizz/productosapi:qa

# 4. Verificar
docker pull ghcr.io/pauliiortizz/productosapi:qa
```

---

## Verificación Final

✅ Token creado con permisos correctos
✅ Login en GHCR funcionando
✅ Paquete visible en GitHub Packages
✅ Repositorio con permisos de escritura
✅ Naming convention clara

**Próximo paso**: Integrar GHCR en tu pipeline de Azure DevOps
