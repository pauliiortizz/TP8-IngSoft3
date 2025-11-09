# 🐳 Guía para construir y ejecutar imágenes Docker

## 📋 Prerrequisitos

- Docker instalado y corriendo
- Conexiones a MongoDB QA y Producción configuradas

## 🔧 Configuración

### 1. Configurar variables de entorno

Antes de ejecutar los contenedores, debes configurar las cadenas de conexión a MongoDB:

**Windows (CMD):**
```cmd
set MONGO_CONNSTR_QA=tu_conexion_mongodb_qa
set MONGO_CONNSTR_PROD=tu_conexion_mongodb_prod
```

**Windows (PowerShell):**
```powershell
$env:MONGO_CONNSTR_QA="tu_conexion_mongodb_qa"
$env:MONGO_CONNSTR_PROD="tu_conexion_mongodb_prod"
```

**O edita directamente `run-containers.bat`** y reemplaza las variables.

## 🏗️ Construir imágenes Docker

### Opción 1: Usando el script automatizado (Recomendado)

```cmd
build-images.bat
```

Este script construirá ambas imágenes:
- `productosapi:qa` - Imagen para QA
- `productosapi:prod` - Imagen para Producción

### Opción 2: Manualmente

**Imagen QA:**
```cmd
docker build -f Backend\Dockerfile.qa -t productosapi:qa .
```

**Imagen Producción:**
```cmd
docker build -f Backend\Dockerfile.prod -t productosapi:prod .
```

## 🚀 Ejecutar contenedores

### Opción 1: Usando el script automatizado

```cmd
run-containers.bat
```

Selecciona el ambiente que deseas ejecutar:
1. Solo QA (puerto 5001)
2. Solo Producción (puerto 5002)
3. Ambos

### Opción 2: Manualmente

**Contenedor QA:**
```cmd
docker run -d ^
  --name productosapi-qa ^
  -p 5001:80 ^
  -e ASPNETCORE_ENVIRONMENT=QA ^
  -e ConnectionStrings__MongoDb="tu_conexion_mongodb_qa" ^
  productosapi:qa
```

**Contenedor Producción:**
```cmd
docker run -d ^
  --name productosapi-prod ^
  -p 5002:80 ^
  -e ASPNETCORE_ENVIRONMENT=Production ^
  -e ConnectionStrings__MongoDb="tu_conexion_mongodb_prod" ^
  productosapi:prod
```

## 🌐 Acceder a las aplicaciones

### QA
- API: http://localhost:5001
- Swagger: http://localhost:5001/swagger
- **Admin Tester: http://localhost:5001/admin.html** ⭐
- Health: http://localhost:5001/health

### Producción
- API: http://localhost:5002
- Swagger: http://localhost:5002/swagger (solo si está habilitado)
- **Admin Tester: http://localhost:5002/admin.html** ⭐
- Health: http://localhost:5002/health

## 🛑 Detener contenedores

### Usando el script:
```cmd
stop-containers.bat
```

### Manualmente:
```cmd
docker stop productosapi-qa productosapi-prod
docker rm productosapi-qa productosapi-prod
```

## 📊 Verificar contenedores

**Ver contenedores en ejecución:**
```cmd
docker ps
```

**Ver logs de un contenedor:**
```cmd
docker logs productosapi-qa
docker logs productosapi-prod
```

**Ver logs en tiempo real:**
```cmd
docker logs -f productosapi-qa
```

## 🔍 Verificar imágenes

```cmd
docker images | findstr productosapi
```

## 🗑️ Limpiar imágenes

```cmd
docker rmi productosapi:qa productosapi:prod
```

## 📝 Notas importantes

1. **admin.html está incluido:** Cada imagen incluye el archivo `admin.html` en `wwwroot/`, por lo que podrás probar tus endpoints en ambos ambientes.

2. **Conexiones a BD separadas:** Cada contenedor se conecta a su respectiva base de datos (QA o Producción) según la variable de entorno `ConnectionStrings__MongoDb`.

3. **Configuración por ambiente:** Cada imagen usa su respectivo `appsettings.{Environment}.json`:
   - QA usa `appsettings.QA.json`
   - Producción usa `appsettings.Production.json`

4. **Puerto por defecto:** Los contenedores exponen el puerto 80 internamente, pero se mapean a puertos diferentes en el host (5001 y 5002) para evitar conflictos.

## 🐛 Troubleshooting

**Si el contenedor no inicia:**
```cmd
docker logs productosapi-qa
```

**Si hay conflicto de puertos:**
Cambia los puertos en `run-containers.bat` o en el comando `docker run`:
```cmd
-p 8001:80  # En lugar de 5001:80
```

**Si no aparece admin.html:**
Verifica que el archivo esté en la imagen:
```cmd
docker exec -it productosapi-qa ls /app/wwwroot
```
