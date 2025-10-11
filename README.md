
# ASP.NET Core Web API + Angular CRUD (2024)

Clonado de https://github.com/zsharadze/ASPNetCoreWebApiCrudAngular y adaptado.

## Prerrequisitos

- .NET SDK 8.0 o superior
- Node.js 20.x y npm
- Google Chrome instalado (para ejecutar tests de Angular en modo ChromeHeadless)

## Ejecutar la API (.NET 8)

1) Abrir Docker y correr el contenedor de la DB "tp6-mysql"

2) Desde una terminal (elegí una de estas dos opciones):

Opción A: entrar al folder del proyecto y ejecutar:

```cmd
cd Backend\Backend
dotnet restore
dotnet build
dotnet run --urls "http://localhost:7150"
```

Opción B: quedarse en la carpeta `Backend`, compilar la solución y ejecutar apuntando al .csproj:

```cmd
cd Backend
dotnet build ProductApi.sln
dotnet run --project Backend/ProductosApi.csproj --urls "http://localhost:7150"
```

3) Abrir: http://localhost:7150/admin

## Ejecutar el Frontend (Angular)

1) En otra terminal:

```cmd
cd Frontend
npm ci
npm start
```

2) Abrir la app: http://localhost:4200/

## Cómo ejecutar tests localmente

### Tests de .NET (xUnit)

Ejecutar el suite de pruebas del backend:

```cmd
cd Backend.Tests
dotnet test -v minimal
```

Salida esperada (resumen):

```
Passed!  - Failed:     0, Passed:    20, Skipped:     0, Total:    20
```

### Tests de Angular (Karma/Jasmine)

Ejecutar una sola vez y salir (modo recomendado):

```cmd
cd Frontend
npm run test:once
```

Con cobertura de código (genera HTML en `Frontend/coverage/html/index.html`):

```cmd
cd Frontend
npm run test:ci
```

Ejecutar en modo watch (desarrollo):

```cmd
cd Frontend
npm run test:watch
```

Salida esperada (resumen):

```
Chrome Headless ...: Executed 20 of 20 SUCCESS
TOTAL: 20 SUCCESS
```

## Evidencias rápidas

- Reporte de cobertura Angular: abrir `Frontend/coverage/html/index.html` tras ejecutar `npm run test:ci`.
- Resultados JUnit/Karma: `Frontend/test-results/test-results.xml`.


