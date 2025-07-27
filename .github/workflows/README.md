# GitHub Actions Workflows

Este directorio contiene los workflows de GitHub Actions para automatizar el build, testing y deployment de la extensión Analista.

## Workflows Disponibles

### 🔨 [`build.yml`](./build.yml) - Build Principal

**Trigger:** Push a `main`/`develop`, Pull Requests, Manual

**Funciones:**

- ✅ Build para Chrome y Firefox
- ✅ Type checking con TypeScript
- ✅ Linting con Biome
- ✅ Creación de ZIPs de distribución
- ✅ Upload de artefactos
- ✅ Release automático en tags

**Matrix Strategy:** Builds paralelos para Chrome y Firefox

### 🚀 [`release.yml`](./release.yml) - Releases

**Trigger:** Tags `v*`, Manual con versión

**Funciones:**

- ✅ Creación automática de releases en GitHub
- ✅ Build y upload de assets para ambos navegadores
- ✅ Documentación de instalación incluida
- ✅ Support para releases manuales

### ⚡ [`ci.yml`](./ci.yml) - Integración Continua

**Trigger:** Push y Pull Requests

**Funciones:**

- ✅ Linting y formateo con Biome
- ✅ Type checking
- ✅ Build testing
- ✅ Auto-merge para Dependabot
- ✅ Verificación de builds

### 🌐 [`deploy.yml`](./deploy.yml) - Deployment a Stores

**Trigger:** Releases publicados, Manual

**Funciones:**

- 🔄 Deployment a Chrome Web Store (configurar)
- 🔄 Deployment a Firefox Add-ons (configurar)
- ✅ Notificaciones de estado

## Configuración Requerida

### Secrets Necesarios (para deployment):

#### Chrome Web Store:

```
CHROME_EXTENSION_KEYS - JSON con credenciales de Chrome Web Store
```

#### Firefox Add-ons:

```
FIREFOX_EXTENSION_UUID - UUID de la extensión en Firefox
FIREFOX_JWT_ISSUER - JWT Issuer de Firefox Add-ons
FIREFOX_JWT_SECRET - JWT Secret de Firefox Add-ons
```

### Permisos de GitHub Token:

- `contents: write` - Para releases
- `pull-requests: write` - Para auto-merge

## Estructura de Artefactos

Los workflows generan los siguientes artefactos:

```
📦 .output/
├── chrome-mv3/              # Chrome build output
│   ├── manifest.json        # Chrome manifest (MV3)
│   ├── background.js        # Service worker
│   ├── popup.html           # Popup interface
│   ├── dashboard.html       # Dashboard interface
│   └── assets/              # Static assets
└── firefox-mv2/             # Firefox build output
    ├── manifest.json        # Firefox manifest (MV2)
    ├── background.js        # Background script
    ├── popup.html           # Popup interface
    ├── dashboard.html       # Dashboard interface
    └── assets/              # Static assets

📦 Artifacts:
├── analista-extension-chrome/     # Chrome build artifacts
├── analista-extension-firefox/    # Firefox build artifacts
├── analista-extension-chrome-zip/ # Chrome ZIP for distribution
└── analista-extension-firefox-zip/# Firefox ZIP for distribution
```

## Uso

### Build Manual:

```bash
# Trigger manual build
gh workflow run build.yml
```

### Release:

```bash
# Crear tag y trigger release
git tag v1.0.0
git push origin v1.0.0

# O trigger manual
gh workflow run release.yml -f version=v1.0.0
```

### Desarrollo:

Los workflows de CI se ejecutan automáticamente en cada push y PR.

## Estados de Build

- ✅ **Configurado y activo**
- 🔄 **Configurado pero deshabilitado**
- ❌ **Requiere configuración**

| Workflow    | Estado | Notas                        |
| ----------- | ------ | ---------------------------- |
| build.yml   | ✅     | Completamente funcional      |
| ci.yml      | ✅     | Completamente funcional      |
| release.yml | ✅     | Completamente funcional      |
| deploy.yml  | 🔄     | Requiere secrets para stores |

## Troubleshooting

### Build Failures:

1. Verificar que todas las dependencias estén en `package.json`
2. Confirmar que `bun install` funciona localmente
3. Revisar logs de TypeScript y Biome

### Release Issues:

1. Verificar formato de tags (`v*`)
2. Confirmar permisos de GitHub Token
3. Revisar que el build sea exitoso

### Deployment Problems:

1. Configurar secrets requeridos
2. Habilitar workflows removiendo `if: false`
3. Verificar credenciales de web stores
