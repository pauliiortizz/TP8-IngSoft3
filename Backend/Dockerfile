# Dockerfile único para todos los ambientes (QA, Production, etc.)
# La configuración del ambiente se define en runtime mediante variables de entorno
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app

# Exponer puertos
EXPOSE 80
EXPOSE 443

# Copiar archivos ya publicados desde el contexto (./publish)
COPY . .

# NO definir ASPNETCORE_ENVIRONMENT aquí
# Se configurará mediante variables de entorno al ejecutar el contenedor
# Esto permite usar la misma imagen para múltiples ambientes

ENTRYPOINT ["dotnet", "ProductosApi.dll"]
