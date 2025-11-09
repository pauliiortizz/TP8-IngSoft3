@echo off
REM Script para construir y publicar imagenes Docker en GitHub Container Registry

echo ========================================
echo Construyendo y publicando imagenes a GHCR
echo ========================================

REM Usuario de GitHub
set GITHUB_USERNAME=pauliiortizz

REM Solicitar token de GitHub
set /p GITHUB_TOKEN="Ingrese su GitHub Personal Access Token: "

REM Cambiar al directorio raiz del proyecto
cd /d %~dp0

echo.
echo [1/5] Iniciando sesion en GitHub Container Registry...
echo %GITHUB_TOKEN% | docker login ghcr.io -u %GITHUB_USERNAME% --password-stdin
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Fallo el login en GHCR
    echo Verifica tu token y permisos
    pause
    exit /b 1
)
echo ✓ Login exitoso en GHCR

echo.
echo [2/5] Construyendo imagen para QA...
docker build -f Backend\Dockerfile.qa -t ghcr.io/%GITHUB_USERNAME%/productosapi:qa .
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Fallo la construccion de la imagen QA
    pause
    exit /b 1
)
echo ✓ Imagen QA construida exitosamente

echo.
echo [3/5] Construyendo imagen para Produccion...
docker build -f Backend\Dockerfile.prod -t ghcr.io/%GITHUB_USERNAME%/productosapi:prod .
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Fallo la construccion de la imagen PROD
    pause
    exit /b 1
)
echo ✓ Imagen PROD construida exitosamente

echo.
echo [4/5] Publicando imagen QA a GHCR...
docker push ghcr.io/%GITHUB_USERNAME%/productosapi:qa
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Fallo la publicacion de la imagen QA
    pause
    exit /b 1
)
echo ✓ Imagen QA publicada exitosamente

echo.
echo [5/5] Publicando imagen PROD a GHCR...
docker push ghcr.io/%GITHUB_USERNAME%/productosapi:prod
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Fallo la publicacion de la imagen PROD
    pause
    exit /b 1
)
echo ✓ Imagen PROD publicada exitosamente

echo.
echo ========================================
echo Imagenes publicadas exitosamente en GHCR:
echo - ghcr.io/%GITHUB_USERNAME%/productosapi:qa
echo - ghcr.io/%GITHUB_USERNAME%/productosapi:prod
echo ========================================
echo.
echo Verifica tus imagenes en:
echo https://github.com/%GITHUB_USERNAME%?tab=packages
echo.
echo Para usar en Render, actualiza las imagenes a:
echo - ghcr.io/%GITHUB_USERNAME%/productosapi:qa
echo - ghcr.io/%GITHUB_USERNAME%/productosapi:prod
echo.

pause
