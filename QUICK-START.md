# 🚀 Guía Rápida: Publicar Imágenes Docker para Render

## 📝 Resumen

Has configurado tu proyecto para:
- ✅ Crear imágenes Docker separadas para QA y Producción
- ✅ Cada imagen incluye `admin.html` para probar endpoints
- ✅ Cada imagen se conecta a su respectiva BD MongoDB
- ✅ Listas para publicar en Docker Hub y usar en Render

---

## 🔥 Pasos Rápidos

### 1️⃣ Inicia Docker Desktop
Asegúrate de que Docker Desktop esté corriendo.

### 2️⃣ Login en Docker Hub
```cmd
docker login
```

### 3️⃣ Construye y publica las imágenes
```cmd
cd c:\Users\BANGHO\TP6
build-images.bat
```

El script te pedirá tu usuario de Docker Hub y:
- Construirá imagen QA
- Construirá imagen Producción  
- Publicará ambas en Docker Hub

### 4️⃣ Usa las imágenes en Render

#### Para QA:
1. Crea un nuevo **Web Service** en Render
2. Selecciona **"Deploy an existing image"**
3. Imagen: `tuusuario/productosapi:qa`
4. Variables de entorno:
   ```
   ASPNETCORE_ENVIRONMENT = QA
   ConnectionStrings__MongoDb = tu_conexion_mongodb_qa
   ASPNETCORE_URLS = http://+:80
   ```

#### Para Producción:
1. Crea otro **Web Service** en Render
2. Imagen: `tuusuario/productosapi:prod`
3. Variables de entorno:
   ```
   ASPNETCORE_ENVIRONMENT = Production
   ConnectionStrings__MongoDb = tu_conexion_mongodb_prod
   ASPNETCORE_URLS = http://+:80
   ```

---

## 🎯 URLs Disponibles (después del deploy)

Render te dará URLs como:
- `https://tu-app-qa.onrender.com`
- `https://tu-app-prod.onrender.com`

### Endpoints:
- **Admin Tester:** `/admin.html` ⭐ (tu página de pruebas)
- **API:** `/api/Product`
- **Swagger:** `/swagger`
- **Health:** `/health`

---

## 🔄 Para actualizar

1. Haz cambios en tu código
2. Ejecuta: `build-images.bat`
3. En Render → **Manual Deploy** → **Deploy latest version**

---

## 📚 Documentación completa

Ver: `RENDER-DEPLOYMENT.md`

---

## ✨ Lo importante

- ✅ `admin.html` está incluido en ambas imágenes
- ✅ No se sobrescribe durante el build
- ✅ Cada ambiente usa su propia conexión MongoDB
- ✅ Las credenciales van en variables de entorno de Render (nunca en el código)
