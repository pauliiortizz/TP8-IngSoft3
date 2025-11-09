# 📦 GitHub Container Registry - Guía Completa

## ✅ Checklist de Implementación

### Fase 1: Configuración de GHCR (15 min)
- [ ] Crear Personal Access Token en GitHub
- [ ] Guardar token de forma segura
- [ ] Hacer login local (testing): `docker login ghcr.io`
- [ ] Verificar acceso correcto

### Fase 2: Publicar Imágenes Manualmente (20 min)
- [ ] Ejecutar `build-images-ghcr.bat`
- [ ] Verificar imágenes en GitHub Packages
- [ ] Hacer paquete público
- [ ] Configurar permisos del repositorio

### Fase 3: Integrar con Azure DevOps (30 min)
- [ ] Crear Service Connection "Docker Registry" a GHCR
- [ ] Actualizar variables en pipeline
- [ ] Agregar stage de Build & Push Docker
- [ ] Ejecutar pipeline y verificar

### Fase 4: Actualizar Render (10 min)
- [ ] Actualizar Web Service QA con imagen GHCR
- [ ] Actualizar Web Service PROD con imagen GHCR
- [ ] Verificar que ambos funcionen

### Fase 5: Documentación (1-2 horas)
- [ ] Documentar proceso de creación de GHCR
- [ ] Documentar configuración de autenticación
- [ ] Documentar integración con pipeline
- [ ] Capturas de pantalla de todo el proceso

---

## 🚀 Quick Start

### 1. Crear Token en GitHub (AHORA)

```
1. GitHub → Settings → Developer settings
2. Personal access tokens → Tokens (classic)
3. Generate new token (classic)
4. Scopes: write:packages, delete:packages, repo
5. Copiar token → ghp_xxxxxxxxxxxx
```

### 2. Publicar Imágenes (5 min)

```cmd
cd c:\Users\BANGHO\TP6
.\build-images-ghcr.bat
```

Cuando te pida el token, pega el que copiaste.

### 3. Verificar en GitHub (1 min)

Ve a: https://github.com/pauliiortizz?tab=packages

Deberías ver: `productosapi` con tags `qa` y `prod`

### 4. Configurar Azure DevOps (10 min)

**Service Connection:**
```
Project Settings → Service connections → New
→ Docker Registry
→ Registry: https://ghcr.io
→ ID: pauliiortizz
→ Password: [tu token]
→ Name: GitHubContainerRegistry
```

### 5. Actualizar Pipeline (15 min)

Agregar este stage después de BuildAndTest:

```yaml
- stage: DockerBuildAndPush
  displayName: 'Build y Push a GHCR'
  dependsOn: BuildAndTestBackAndFront
  jobs:
    - job: BuildPush
      pool:
        vmImage: 'ubuntu-latest'
      steps:
        - task: Docker@2
          displayName: 'Build & Push QA'
          inputs:
            containerRegistry: 'GitHubContainerRegistry'
            repository: 'pauliiortizz/productosapi'
            command: 'buildAndPush'
            Dockerfile: 'Backend/Dockerfile.qa'
            tags: 'qa'
```

### 6. Actualizar Render (5 min)

En cada Web Service de Render:
```
Image URL: ghcr.io/pauliiortizz/productosapi:qa
```

---

## 📝 Para la Documentación del TP

### Sección: Configuración de Container Registry

**1. Creación del Registry**
```
- Elegí GitHub Container Registry porque:
  * Totalmente gratuito (vs ACR que cuesta $5-20/mes)
  * Integrado con GitHub (donde está mi código)
  * Soporta imágenes públicas y privadas
  * Fácil integración con GitHub Actions
  * No requiere tarjeta de crédito
```

**2. Autenticación y Permisos**
```
- Configuré Personal Access Token con scopes:
  * write:packages - Para publicar imágenes
  * delete:packages - Para limpiar imágenes antiguas
  * repo - Para acceso desde el repositorio
  
- Configuré permisos del paquete:
  * Visibilidad: Pública
  * Repository access: Write para TP8-IngSoft3
```

**3. Integración con Pipeline**
```
- Creé Service Connection en Azure DevOps
- Actualicé pipeline para build y push automático
- Tags usados: qa, prod, qa-[buildId]
- Deploy automático a Render al actualizar imagen
```

**4. Evidencia**
```
- Captura: GitHub Packages con imágenes
- Captura: Service Connection en Azure DevOps
- Captura: Pipeline ejecutándose exitosamente
- Captura: Render usando imágenes de GHCR
```

---

## 🎯 Respuestas para la Defensa Oral

### ¿Por qué elegiste GHCR y no ACR?

**Respuesta:**
```
Elegí GHCR por las siguientes razones técnicas y prácticas:

1. COSTO:
   - GHCR: Completamente gratis para imágenes públicas
   - ACR: $5-20/mes mínimo
   - Consideración: Como estudiante, priorizo costo cero

2. INTEGRACIÓN:
   - Mi código ya está en GitHub
   - GHCR se integra nativamente con GitHub Actions
   - Simplifica el CI/CD pipeline

3. ACCESIBILIDAD:
   - No requiere suscripción a Azure
   - No requiere tarjeta de crédito
   - Paquetes públicos son accesibles por cualquiera

4. FUNCIONALIDAD:
   - Soporta Docker OCI estándar
   - Versionado con tags
   - Gestión de permisos granular
   
En un entorno empresarial usaría ACR si:
- Ya tengo infraestructura en Azure
- Necesito geo-replicación
- Requiero compliance estricto
- Presupuesto no es limitación
```

### ¿Cómo configuraste la autenticación?

**Respuesta:**
```
Implementé autenticación con Personal Access Token:

1. Creé PAT con permisos mínimos necesarios (write:packages)
2. Configuré Service Connection en Azure DevOps
3. El token se almacena encriptado en ADO
4. El pipeline usa la Service Connection (no expone el token)

Alternativas consideradas:
- GitHub App: Más seguro pero más complejo
- OIDC: Ideal pero requiere más setup
- Username/Password: Menos seguro

Elegí PAT por balance entre seguridad y simplicidad.
```

### ¿Qué estrategia de tagging usaste?

**Respuesta:**
```
Estrategia de tagging multi-etiqueta:

Para QA:
- qa (siempre apunta a última versión QA)
- qa-[buildId] (versión específica)
- qa-[commitHash] (trazabilidad)

Para PROD:
- prod (última versión en producción)
- prod-[buildId] (versión específica)
- latest (convencionalmente última stable)

Ventajas:
- Puedo hacer rollback a versión específica
- "qa" y "prod" siempre actualizadas
- Trazabilidad completa con build IDs

En producción real agregaría:
- Semantic versioning (v1.0.0)
- Tags inmutables para compliance
- Firma de imágenes para seguridad
```

---

## 📊 Comparativa: GHCR vs Alternativas

| Característica | GHCR | Docker Hub | ACR | GitLab CR |
|----------------|------|------------|-----|-----------|
| **Costo** | Gratis | Gratis (1 privado) | $5-20/mes | Gratis |
| **Storage** | Ilimitado | 1 GB free | Por uso | 10 GB free |
| **Integración GitHub** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ | ⭐⭐ |
| **Integración Azure** | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ |
| **Privacidad** | Público/Privado | 1 privado | Ilimitado | Ilimitado |
| **Geo-replicación** | ❌ | ❌ | ✅ | ❌ |
| **Facilidad setup** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |

**Mi elección: GHCR**
- Mejor para este TP por costo cero y simplicidad
- Producción real: ACR si ya uso Azure, o GHCR si todo es GitHub

---

## 🔗 Links Útiles

- GHCR Docs: https://docs.github.com/packages/working-with-a-github-packages-registry/working-with-the-container-registry
- Tus paquetes: https://github.com/pauliiortizz?tab=packages
- Azure DevOps Service Connections: https://docs.microsoft.com/azure/devops/pipelines/library/service-endpoints

---

**Próximo paso:** Ejecutar `.\build-images-ghcr.bat` y verificar que funcione! 🚀
