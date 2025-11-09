# 🔄 Integración de GHCR en Azure DevOps Pipeline

## Paso 1: Crear Service Connection en Azure DevOps

### 1.1 Crear Docker Registry Service Connection

1. En tu proyecto de Azure DevOps → **Project Settings** (abajo a la izquierda)

2. Click en **Service connections** → **New service connection**

3. Buscar y seleccionar **"Docker Registry"**

4. Configurar:
   - **Registry type**: `Others`
   - **Docker Registry**: `https://ghcr.io`
   - **Docker ID**: `pauliiortizz` (tu usuario de GitHub)
   - **Docker Password**: Tu Personal Access Token de GitHub (el que creaste)
   - **Service connection name**: `GitHubContainerRegistry`
   - ✅ **Grant access permission to all pipelines**

5. Click **"Verify and save"**

---

## Paso 2: Agregar Variables al Pipeline

En tu `azure-pipelines-merged.yml`, actualizar las variables:

```yaml
variables:
  # GitHub Container Registry variables
  containerRegistry: 'GitHubContainerRegistry'  # Nombre de la service connection
  imageRepository: 'productosapi'
  registryUrl: 'ghcr.io'
  githubUsername: 'pauliiortizz'
  
  # Nombres completos de las imágenes
  backImageQA: 'ghcr.io/pauliiortizz/productosapi:qa'
  backImagePROD: 'ghcr.io/pauliiortizz/productosapi:prod'
  
  # Tags
  imageTag: '$(Build.BuildId)'  # O usar 'latest', 'qa', 'prod'
```

---

## Paso 3: Actualizar Stage de Build Docker

### Opción A: Usando Docker task (Recomendado)

```yaml
stages:
# =======================================
# 🐳 BUILD & PUSH DOCKER IMAGES
# =======================================
- stage: DockerBuildAndPush
  displayName: 'Build y Push Imágenes a GHCR'
  dependsOn: BuildAndTestBackAndFront
  jobs:
    - job: BuildAndPushDockerImages
      displayName: 'Construir y Publicar Imágenes Docker'
      pool:
        vmImage: 'ubuntu-latest'
      
      steps:
        - checkout: self

        # Build y Test ya completados en stage anterior
        
        #------------------------------------------------------
        # DOWNLOAD ARTIFACTS
        #------------------------------------------------------
        - task: DownloadPipelineArtifact@2
          displayName: 'Descargar Artefactos de Back'
          inputs:
            buildType: 'current'
            artifactName: 'drop'
            targetPath: '$(Pipeline.Workspace)/drop'

        #------------------------------------------------------
        # BUILD & PUSH QA IMAGE
        #------------------------------------------------------
        - task: Docker@2
          displayName: 'Build Imagen QA'
          inputs:
            containerRegistry: '$(containerRegistry)'
            repository: '$(githubUsername)/$(imageRepository)'
            command: 'build'
            Dockerfile: 'Backend/Dockerfile.qa'
            buildContext: '$(Pipeline.Workspace)/drop'
            tags: |
              qa
              qa-$(Build.BuildId)

        - task: Docker@2
          displayName: 'Push Imagen QA a GHCR'
          inputs:
            containerRegistry: '$(containerRegistry)'
            repository: '$(githubUsername)/$(imageRepository)'
            command: 'push'
            tags: |
              qa
              qa-$(Build.BuildId)

        #------------------------------------------------------
        # BUILD & PUSH PROD IMAGE
        #------------------------------------------------------
        - task: Docker@2
          displayName: 'Build Imagen PROD'
          inputs:
            containerRegistry: '$(containerRegistry)'
            repository: '$(githubUsername)/$(imageRepository)'
            command: 'build'
            Dockerfile: 'Backend/Dockerfile.prod'
            buildContext: '$(Pipeline.Workspace)/drop'
            tags: |
              prod
              prod-$(Build.BuildId)
              latest

        - task: Docker@2
          displayName: 'Push Imagen PROD a GHCR'
          inputs:
            containerRegistry: '$(containerRegistry)'
            repository: '$(githubUsername)/$(imageRepository)'
            command: 'push'
            tags: |
              prod
              prod-$(Build.BuildId)
              latest
```

### Opción B: Usando Script (Alternativa)

```yaml
- stage: DockerBuildAndPush
  displayName: 'Build y Push Imágenes a GHCR'
  dependsOn: BuildAndTestBackAndFront
  jobs:
    - job: BuildAndPushDockerImages
      pool:
        vmImage: 'ubuntu-latest'
      
      steps:
        - checkout: self
        
        - task: DownloadPipelineArtifact@2
          displayName: 'Descargar Artefactos'
          inputs:
            buildType: 'current'
            artifactName: 'drop'
            targetPath: '$(Pipeline.Workspace)/drop'

        - task: Docker@2
          displayName: 'Login en GHCR'
          inputs:
            command: login
            containerRegistry: '$(containerRegistry)'

        - script: |
            # Build QA
            docker build -f Backend/Dockerfile.qa \
              -t $(registryUrl)/$(githubUsername)/$(imageRepository):qa \
              -t $(registryUrl)/$(githubUsername)/$(imageRepository):qa-$(Build.BuildId) \
              $(Pipeline.Workspace)/drop
            
            # Push QA
            docker push $(registryUrl)/$(githubUsername)/$(imageRepository):qa
            docker push $(registryUrl)/$(githubUsername)/$(imageRepository):qa-$(Build.BuildId)
            
            # Build PROD
            docker build -f Backend/Dockerfile.prod \
              -t $(registryUrl)/$(githubUsername)/$(imageRepository):prod \
              -t $(registryUrl)/$(githubUsername)/$(imageRepository):prod-$(Build.BuildId) \
              $(Pipeline.Workspace)/drop
            
            # Push PROD
            docker push $(registryUrl)/$(githubUsername)/$(imageRepository):prod
            docker push $(registryUrl)/$(githubUsername)/$(imageRepository):prod-$(Build.BuildId)
          displayName: 'Build y Push Imágenes Docker'
```

---

## Paso 4: Actualizar Deploy Stages

### Para Render (o el hosting que uses)

Si usas Render, necesitas actualizar las URLs de las imágenes en tus Web Services:

```yaml
- stage: UpdateRenderServices
  displayName: 'Actualizar servicios en Render'
  dependsOn: DockerBuildAndPush
  jobs:
    - job: UpdateRender
      steps:
        - script: |
            # Llamar a Render API para actualizar imagen
            curl -X POST https://api.render.com/deploy/srv-XXXXX?key=YYYY
          displayName: 'Trigger Render Deploy QA'
```

---

## Paso 5: Verificación

### Checklist de verificación:

✅ Service Connection a GHCR creada en Azure DevOps
✅ Variables actualizadas en el pipeline
✅ Stage de Docker Build actualizado
✅ Pipeline ejecutándose sin errores
✅ Imágenes visibles en GitHub Packages
✅ Render actualizado con nuevas URLs de GHCR

### Verificar imágenes en GitHub:

1. Ve a: https://github.com/pauliiortizz?tab=packages
2. Deberías ver el paquete `productosapi` con tags `qa` y `prod`

---

## Troubleshooting

### Error: "authentication required"
- Verificar que el PAT tenga scope `write:packages`
- Verificar que el Service Connection esté correctamente configurado

### Error: "denied: permission_denied"
- Ir a Package settings → Manage Actions access
- Agregar tu repositorio con permiso "Write"

### Error: "manifest unknown"
- Verificar que la imagen se construyó correctamente
- Revisar logs del stage de build

---

## Mejores Prácticas

1. **Versionado**: Usar múltiples tags
   ```
   qa
   qa-123 (build number)
   qa-abc123 (commit hash)
   ```

2. **Seguridad**: 
   - Usar PAT con permisos mínimos necesarios
   - Rotar tokens periódicamente
   - No commitear tokens en el repo

3. **Limpieza**:
   - Eliminar imágenes antiguas regularmente
   - Usar políticas de retención

4. **Monitoreo**:
   - Verificar tamaño de imágenes
   - Monitorear uso de storage
   - Trackear builds fallidos
