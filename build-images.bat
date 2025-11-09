@echo off
REM Script para construir y publicar imagenes Docker para QA y Produccion

echo ========================================
echo Construyendo y publicando imagenes Docker
echo ========================================

REM Solicitar nombre de usuario de Docker Hub
set /p DOCKER_USERNAME="Ingrese su usuario de Docker Hub: "

REM Cambiar al directorio raiz del proyecto
cd /d %~dp0

echo.
echo [1/4] Construyendo imagen para QA...
docker build -f Backend\Dockerfile.qa -t %DOCKER_USERNAME%/productosapi:qa .
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Fallo la construccion de la imagen QA
    pause
    exit /b 1
)
echo ✓ Imagen QA construida exitosamente

echo.
echo [2/4] Construyendo imagen para Produccion...
docker build -f Backend\Dockerfile.prod -t %DOCKER_USERNAME%/productosapi:prod .
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Fallo la construccion de la imagen PROD
    pause
    exit /b 1
)
echo ✓ Imagen PROD construida exitosamente

echo.
echo [3/4] Publicando imagen QA a Docker Hub...
docker push %DOCKER_USERNAME%/productosapi:qa
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Fallo la publicacion de la imagen QA
    echo ¿Hiciste login en Docker Hub? Ejecuta: docker login
    pause
    exit /b 1
)
echo ✓ Imagen QA publicada exitosamente

echo.
echo [4/4] Publicando imagen PROD a Docker Hub...
docker push %DOCKER_USERNAME%/productosapi:prod
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Fallo la publicacion de la imagen PROD
    pause
    exit /b 1
)
echo ✓ Imagen PROD publicada exitosamente

echo.
echo ========================================
echo Imagenes publicadas exitosamente:
echo - %DOCKER_USERNAME%/productosapi:qa
echo - %DOCKER_USERNAME%/productosapi:prod
echo ========================================
echo.
echo Ahora puedes usar estas imagenes en Render:
echo 1. Crea un nuevo Web Service en Render
echo 2. Selecciona "Deploy an existing image from a registry"
echo 3. Usa la imagen: %DOCKER_USERNAME%/productosapi:qa (o prod)
echo 4. Configura las variables de entorno en Render
echo.

pause
