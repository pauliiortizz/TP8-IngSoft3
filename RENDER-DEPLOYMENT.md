# 🚀 Desplegar en Render usando imágenes Docker

## 📋 Prerrequisitos

1. **Cuenta en Docker Hub** (https://hub.docker.com)
2. **Cuenta en Render** (https://render.com)
3. **Docker Desktop** instalado y corriendo
4. **Imágenes construidas y publicadas** en Docker Hub

---

## 🔧 Paso 1: Construir y publicar imágenes

### 1.1 Login en Docker Hub

```cmd
docker login
```

Ingresa tu usuario y contraseña de Docker Hub.

### 1.2 Construir y publicar las imágenes

```cmd
build-images.bat
```

Este script te pedirá tu usuario de Docker Hub y:
- ✅ Construirá la imagen QA
- ✅ Construirá la imagen Producción
- ✅ Publicará ambas imágenes en Docker Hub

Las imágenes quedarán disponibles como:
- `tuusuario/productosapi:qa`
- `tuusuario/productosapi:prod`

---

## 🌐 Paso 2: Desplegar en Render

### 2.1 Crear servicio para QA

1. Ve a https://dashboard.render.com
2. Click en **"New +"** → **"Web Service"**
3. Selecciona **"Deploy an existing image from a registry"**
4. En **"Image URL"** ingresa: `tuusuario/productosapi:qa`
5. Configura:
   - **Name:** `productosapi-qa`
   - **Region:** Elige la más cercana
   - **Instance Type:** Free o el que necesites

### 2.2 Configurar variables de entorno para QA

En la sección **"Environment Variables"**, agrega:

```
ASPNETCORE_ENVIRONMENT = QA
ConnectionStrings__MongoDb = tu_conexion_mongodb_qa
ASPNETCORE_URLS = http://+:80
```

**Importante:** Render asigna un puerto dinámico, pero .NET escucha en el puerto 80 por defecto (ya configurado en el Dockerfile).

### 2.3 Crear servicio para Producción

Repite los pasos pero con:
- **Image URL:** `tuusuario/productosapi:prod`
- **Name:** `productosapi-prod`
- **Variables de entorno:**
  ```
  ASPNETCORE_ENVIRONMENT = Production
  ConnectionStrings__MongoDb = tu_conexion_mongodb_prod
  ASPNETCORE_URLS = http://+:80
  ```

---

## 🎯 Paso 3: Acceder a tu aplicación

Una vez desplegado, Render te dará una URL como:

- **QA:** `https://productosapi-qa.onrender.com`
- **Producción:** `https://productosapi-prod.onrender.com`

### Endpoints disponibles:

✅ **Admin Tester:** `https://productosapi-qa.onrender.com/admin.html` ⭐  
✅ **API:** `https://productosapi-qa.onrender.com/api/Product`  
✅ **Swagger:** `https://productosapi-qa.onrender.com/swagger`  
✅ **Health Check:** `https://productosapi-qa.onrender.com/health`

---

## 🔄 Actualizar imágenes

Cuando hagas cambios en tu código:

### 1. Reconstruir y publicar
```cmd
build-images.bat
```

### 2. En Render:
- Ve a tu servicio
- Click en **"Manual Deploy"** → **"Deploy latest version"**
- Render descargará la nueva imagen automáticamente

**O mejor:** Configura **Auto-Deploy** en Render para que se actualice automáticamente cuando publiques una nueva imagen.

---

## 📝 Variables de entorno importantes

### Para QA y Producción:

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `ASPNETCORE_ENVIRONMENT` | Ambiente de ejecución | `QA` o `Production` |
| `ConnectionStrings__MongoDb` | Conexión a MongoDB | `mongodb+srv://...` |
| `ASPNETCORE_URLS` | URL de escucha | `http://+:80` |

### Opcional (si usas HTTPS):
| Variable | Descripción |
|----------|-------------|
| `ASPNETCORE_Kestrel__Certificates__Default__Path` | Ruta al certificado |
| `ASPNETCORE_Kestrel__Certificates__Default__Password` | Contraseña del cert |

---

## 🐛 Troubleshooting

### La imagen no se encuentra
- Verifica que hiciste `docker login`
- Verifica que la imagen esté en Docker Hub: https://hub.docker.com/repositories
- Asegúrate de usar el nombre correcto: `usuario/productosapi:qa`

### admin.html no aparece
- Verifica que el archivo esté en la imagen:
  ```cmd
  docker run --rm tuusuario/productosapi:qa ls /app/wwwroot
  ```
  Deberías ver `admin.html` en la lista

### Error de conexión a MongoDB
- Verifica que la variable `ConnectionStrings__MongoDb` esté correctamente configurada en Render
- Asegúrate de que tu cluster MongoDB permita conexiones desde cualquier IP (0.0.0.0/0) o desde las IPs de Render

### La aplicación no inicia
- Revisa los logs en Render: **"Logs"** tab
- Verifica que `ASPNETCORE_URLS` esté configurado como `http://+:80`

---

## 💡 Tips

1. **Usa Docker Hub público** si no tienes problemas con que las imágenes sean públicas
2. **O usa GitHub Container Registry** si prefieres mantener privacidad
3. **Etiqueta tus imágenes con versiones:** `tuusuario/productosapi:qa-v1.0.0`
4. **Configura health checks** en Render apuntando a `/health`
5. **Habilita Auto-Deploy** en Render para despliegues automáticos

---

## 🔐 Seguridad

- ⚠️ **NO** incluyas las cadenas de conexión en el Dockerfile
- ✅ **SÍ** usa variables de entorno en Render
- ✅ Mantén tus credenciales de MongoDB seguras
- ✅ Usa secretos en Render para información sensible

---

## 📊 Diferencias entre QA y Producción

| Aspecto | QA | Producción |
|---------|----|-----------:|
| Imagen Docker | `tuusuario/productosapi:qa` | `tuusuario/productosapi:prod` |
| Variable de ambiente | `ASPNETCORE_ENVIRONMENT=QA` | `ASPNETCORE_ENVIRONMENT=Production` |
| Base de datos | MongoDB QA | MongoDB Producción |
| Swagger | ✅ Habilitado | ⚠️ Opcional |
| Logging | Más verbose | Solo errores/warnings |

---

## 🎉 ¡Listo!

Ahora tienes:
- ✅ Imágenes Docker separadas para QA y Producción
- ✅ Cada una con su archivo `admin.html` para probar endpoints
- ✅ Configuración lista para desplegar en Render
- ✅ Conexiones independientes a cada base de datos MongoDB
