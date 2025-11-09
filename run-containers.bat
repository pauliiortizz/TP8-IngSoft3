@echo off
REM Script para ejecutar contenedores Docker con las conexiones a BD correspondientes

echo ========================================
echo Ejecutar contenedores Docker
echo ========================================
echo.
echo Seleccione el ambiente a ejecutar:
echo 1. QA
echo 2. Produccion
echo 3. Ambos
echo.
set /p ambiente="Ingrese opcion (1-3): "

if "%ambiente%"=="1" goto :qa
if "%ambiente%"=="2" goto :prod
if "%ambiente%"=="3" goto :both
echo Opcion invalida
pause
exit /b 1

:qa
echo.
echo Iniciando contenedor QA en puerto 5001...
docker run -d ^
  --name productosapi-qa ^
  -p 5001:80 ^
  -e ASPNETCORE_ENVIRONMENT=QA ^
  -e ConnectionStrings__MongoDb="%MONGO_CONNSTR_QA%" ^
  productosapi:qa

if %ERRORLEVEL% EQU 0 (
    echo ✓ Contenedor QA iniciado exitosamente
    echo   URL: http://localhost:5001
    echo   Admin: http://localhost:5001/admin.html
) else (
    echo ERROR: Fallo al iniciar contenedor QA
)
goto :end

:prod
echo.
echo Iniciando contenedor PROD en puerto 5002...
docker run -d ^
  --name productosapi-prod ^
  -p 5002:80 ^
  -e ASPNETCORE_ENVIRONMENT=Production ^
  -e ConnectionStrings__MongoDb="%MONGO_CONNSTR_PROD%" ^
  productosapi:prod

if %ERRORLEVEL% EQU 0 (
    echo ✓ Contenedor PROD iniciado exitosamente
    echo   URL: http://localhost:5002
    echo   Admin: http://localhost:5002/admin.html
) else (
    echo ERROR: Fallo al iniciar contenedor PROD
)
goto :end

:both
echo.
echo Iniciando contenedor QA en puerto 5001...
docker run -d ^
  --name productosapi-qa ^
  -p 5001:80 ^
  -e ASPNETCORE_ENVIRONMENT=QA ^
  -e ConnectionStrings__MongoDb="%MONGO_CONNSTR_QA%" ^
  productosapi:qa

if %ERRORLEVEL% EQU 0 (
    echo ✓ Contenedor QA iniciado exitosamente
) else (
    echo ERROR: Fallo al iniciar contenedor QA
)

echo.
echo Iniciando contenedor PROD en puerto 5002...
docker run -d ^
  --name productosapi-prod ^
  -p 5002:80 ^
  -e ASPNETCORE_ENVIRONMENT=Production ^
  -e ConnectionStrings__MongoDb="%MONGO_CONNSTR_PROD%" ^
  productosapi:prod

if %ERRORLEVEL% EQU 0 (
    echo ✓ Contenedor PROD iniciado exitosamente
) else (
    echo ERROR: Fallo al iniciar contenedor PROD
)

echo.
echo Contenedores iniciados:
echo   QA:   http://localhost:5001 - Admin: http://localhost:5001/admin.html
echo   PROD: http://localhost:5002 - Admin: http://localhost:5002/admin.html

:end
echo.
echo Para detener los contenedores ejecute: stop-containers.bat
echo.
pause
