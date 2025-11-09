@echo off
REM Script para detener y eliminar contenedores Docker

echo ========================================
echo Deteniendo contenedores Docker
echo ========================================

echo.
echo Deteniendo contenedor QA...
docker stop productosapi-qa 2>nul
docker rm productosapi-qa 2>nul
if %ERRORLEVEL% EQU 0 (
    echo ✓ Contenedor QA detenido y eliminado
) else (
    echo ! Contenedor QA no estaba ejecutandose
)

echo.
echo Deteniendo contenedor PROD...
docker stop productosapi-prod 2>nul
docker rm productosapi-prod 2>nul
if %ERRORLEVEL% EQU 0 (
    echo ✓ Contenedor PROD detenido y eliminado
) else (
    echo ! Contenedor PROD no estaba ejecutandose
)

echo.
echo Contenedores detenidos exitosamente
pause
