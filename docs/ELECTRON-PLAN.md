# LLM Trust Desktop — Architecture Plan ⚡

> Electron app pour télécharger et exécuter des LLMs localement.
> Comme Ollama, mais en mieux — avec le design Neural Glow de LLM Trust.

**Author:** Volt (CroissantLabs Electron Dept)
**Date:** 2026-03-13
**Budget:** 0€

---

## 1. Architecture Technique

### 1.1 Stack Choisi

| Layer | Techno | Raison |
|-------|--------|--------|
| Shell | **Electron 34+** | Desktop cross-platform |
| Bundler | **Vite** (electron-vite) | Pas Next.js ici — SSR inutile en desktop, Vite = HMR instantané, config simple, bundle optimisé |
| UI | **React 19 + TypeScript** | Conforme au web |
| Component lib | **shadcn/ui + Tailwind CSS v4** | Réutilise les composants du web |
| State | **Zustand** | Lightweight, pas besoin de Redux |
| API client | **tRPC client** | Même API que le web (llmtrust.com) |
| DB locale | **SQLite via better-sqlite3** | Cache offline, historique, prefs |
| Inference engine | **llama.cpp (node-llama-cpp)** | Natif Node.js, pas besoin d'Ollama externe |

### 1.2 Pourquoi Vite et pas Next.js

- Electron n'a pas besoin de SSR/SSG — c'est une SPA embarquée
- Next.js ajoute du poids et de la complexité inutile (routing file-based, server components)
- **electron-vite** gère nativement les 3 processus Electron (main, preload, renderer)
- HMR < 50ms vs le hot-reload lent de Next.js
- Build plus petit et plus rapide

### 1.3 Moteur d'Inférence — llama.cpp via node-llama-cpp

**Architecture :**
```
┌──────────────────────────────────────────────┐
│  Renderer (React UI)                         │
│  - Chat interface                            │
│  - Model browser                             │
└──────────────┬───────────────────────────────┘
               │ IPC (contextBridge)
┌──────────────▼───────────────────────────────┐
│  Preload Script                              │
│  - window.llmTrust.* API (typed)             │
└──────────────┬───────────────────────────────┘
               │
┌──────────────▼───────────────────────────────┐
│  Main Process (Node.js)                      │
│                                              │
│  ┌─────────────┐  ┌────────────────────┐     │
│  │ ModelManager│  │ InferenceEngine    │     │
│  │ - download  │  │ - load model       │     │
│  │ - delete    │  │ - generate/stream  │     │
│  │ - list      │  │ - context mgmt     │     │
│  │ - storage   │  └────────┬───────────┘     │
│  └─────────────┘           │                 │
│                            ▼                 │
│                   node-llama-cpp             │
│                   (llama.cpp bindings)       │
└──────────────────────────────────────────────┘
```

**Pourquoi node-llama-cpp et pas Ollama :**
- Ollama = processus externe séparé → installation complexe pour l'utilisateur
- node-llama-cpp = npm install, tout est embarqué dans l'app
- API JavaScript directe, pas de HTTP localhost
- Streaming natif via async iterables
- Supporte GGUF (format universel HuggingFace)

**Alternatives considérées :**
- Ollama en subprocess → lourd, dépendance externe
- WebLLM (GPU web) → limité par WebGL, pas d'accès disque direct
- Transformers.js → pas optimisé pour gros modèles

### 1.4 Communication IPC

**Pattern recommandé :** Typed IPC avec `contextBridge`

```typescript
// preload.ts — expose API sécurisée au renderer
const llmTrust = {
  models: {
    list: () => ipcRenderer.invoke('models:list'),
    download: (modelId: string) => ipcRenderer.invoke('models:download', modelId),
    delete: (modelId: string) => ipcRenderer.invoke('models:delete', modelId),
    getStorageInfo: () => ipcRenderer.invoke('models:storage-info'),
  },
  inference: {
    load: (modelId: string) => ipcRenderer.invoke('inference:load', modelId),
    generate: (prompt: string, options?: GenOptions) => ipcRenderer.invoke('inference:generate', prompt, options),
    stream: (prompt: string, options?: GenOptions) => {
      // Retourne un ReadableStream via channel dédié
      const channel = `inference:stream:${Date.now()}`;
      ipcRenderer.invoke('inference:stream-start', channel, prompt, options);
      return new ReadableStream({
        start(controller) {
          ipcRenderer.on(channel, (_, data) => {
            if (data.done) controller.close();
            else controller.enqueue(data.token);
          });
        }
      });
    },
    stop: () => ipcRenderer.invoke('inference:stop'),
    unload: () => ipcRenderer.invoke('inference:unload'),
  },
  sync: {
    login: (token: string) => ipcRenderer.invoke('sync:login', token),
    syncFavorites: () => ipcRenderer.invoke('sync:favorites'),
    syncHistory: () => ipcRenderer.invoke('sync:history'),
    discoverModels: () => ipcRenderer.invoke('sync:discover'),
  },
  settings: {
    get: (key: string) => ipcRenderer.invoke('settings:get', key),
    set: (key: string, value: unknown) => ipcRenderer.invoke('settings:set', key, value),
  }
};
```

### 1.5 Gestion des Téléchargements de Modèles

**Source :** HuggingFace Hub (API publique, pas de clé nécessaire pour modèles publics)

**Flow :**
1. User browse la Model Library (feed depuis l'API web llmtrust.com)
2. Clique "Download" → Main process démarre téléchargement via `@huggingface/hub` ou fetch streaming
3. Progress : streaming chunks → IPC progress events → UI progress bar
4. Fichier `.gguf` sauvegardé dans `app.getPath('userData')/models/`
5. Hash vérifié (SHA256) post-download
6. Modèle listé comme "Installed"

**Téléchargement résilient :**
- Resume support via HTTP Range headers
- Queue de téléchargements (1 à la fois par défaut)
- Pause/Resume/Cancel
- Retry automatique sur erreur réseau

### 1.6 Stockage Local des Modèles

```
~/Library/Application Support/llmtrust-desktop/   (macOS)
├── models/
│   ├── meta-llama-llama-3.1-8b-q4_k_m.gguf     (~4.7 GB)
│   ├── mistral-7b-instruct-q4_k_m.gguf          (~4.1 GB)
│   └── .download/
│       └── {modelId}.gguf.partial                (resume)
├── db/
│   └── llmtrust.db                               (SQLite: historique, prefs, cache)
├── settings.json                                  (config user)
└── logs/
```

**Persistance :** SQLite pour :
- Historique de conversations
- Modèles favoris / récents
- Cache du catalogue de modèles (depuis API web)
- User preferences

---

## 2. UI/UX — Design Neural Glow

### 2.1 Design System

Réutilise la **Brand Identity** du web llmtrust.com :
- **Palette :** Fond sombre (#0A0A0F), Violet primaire (#8B5CF6), Ambre accent (#F59E0B)
- **Glow effects :** box-shadow violet sur les éléments actifs/boutons
- **Fonts :** Inter (UI) + JetBrains Mono (code/technical)
- **shadcn/ui** avec theme custom identique au web

### 2.2 Navigation & Layout

```
┌─────────────────────────────────────────────────┐
│  ◉ ◉ ◉    LLM Trust Desktop        ─ □ ✕      │  (titlebar custom)
├──────┬──────────────────────────────────────────┤
│      │                                          │
│ 🏠   │                                          │
│      │          Content Area                    │
│ 📦   │                                          │
│      │          (Router Outlet)                 │
│ 💬   │                                          │
│      │                                          │
│ ⚙️   │                                          │
│      │                                          │
└──────┴──────────────────────────────────────────┘
```

**Sidebar** (64px width, icon-only, collapsible) :
- 🏠 **Home** — Dashboard, stats, quick launch
- 📦 **Models** — Library locale + discovery web
- 💬 **Chat** — Interface de conversation
- ⚙️ **Settings** — Config, storage, account

### 2.3 Pages Détaillées

#### Home (`/`)
- Welcome message + stat cards (models installed, storage used, last session)
- "Recently Used" models quick-launch
- "Discover" section → trending models from web API
- System info : RAM available, GPU detected

#### Models (`/models`)
- **Installed tab** : Liste des modèles locaux avec taille, quantization, date download
  - Actions : Delete, Load for chat, Info
  - Storage bar en bas : "12.8 GB / 256 GB used"
- **Discover tab** : Catalogue depuis l'API web llmtrust.com
  - Filtres : size, quantization, family, use case
  - "Download" button → ajoute à la queue
  - Badge "Recommended" / "Trending"
- **Downloads tab** : Queue active avec progress bars

#### Chat (`/chat`)
- **Model selector** dropdown en haut
- **Conversation area** : Messages avec markdown rendering + code highlighting
- **Input bar** en bas : textarea + send button + stop button (pendant streaming)
- Sidebar droite optionnelle : context/params (temperature, max tokens, system prompt)
- Streaming response avec cursor animé
- Regenerate / Copy / Edit message actions

#### Settings (`/settings`)
- **General** : Theme (dark/light), language, default model
- **Models** : Storage path, auto-cleanup, max storage limit
- **Inference** : Default params (context size, threads, GPU layers)
- **Account** : Login to llmtrust.com (for sync)
- **Advanced** : Logs, cache clear, about

### 2.4 Composants Partagés avec le Web

Extraction dans un **package `@llmtrust/ui** (monorepo ou npm) :
- `ModelCard` — carte de modèle avec metadata
- `ChatMessage` — bulle de conversation
- `DownloadProgress` — barre de progression
- `StorageIndicator` — usage disque
- Theme tokens (colors, shadows, fonts)

Pour l'instant (MVP) : copie des composants shadcn/ui du web, même tokens CSS.

---

## 3. Sync avec la Web Platform

### 3.1 Architecture Sync

```
┌─────────────────┐     tRPC      ┌─────────────────┐
│  Desktop App    │ ◄──────────► │  llmtrust.com   │
│  (Electron)     │              │  (Next.js API)  │
│                 │              │                 │
│  ┌───────────┐  │              │  ┌───────────┐  │
│  │ SQLite DB │  │              │  │ PostgreSQL│  │
│  │ (local)   │  │              │  │ (Neon)    │  │
│  └───────────┘  │              │  └───────────┘  │
└─────────────────┘              └─────────────────┘
```

### 3.2 Data Sync Strategy — Offline-First

**Principe :** L'app fonctionne à 100% sans connexion. Le sync est optionnel et enrichit l'expérience.

| Data | Direction | Strategy |
|------|-----------|----------|
| **Model Catalog** | Web → Desktop | Cache local, refresh périodique (24h), fallback sur cache |
| **Favorites** | Bidirectional | Last-write-wins, merge additive |
| **Chat History** | Desktop → Web | Push on sync, encrypted optionnel |
| **User Profile** | Web → Desktop | Read-only cache |
| **Reviews/Ratings** | Desktop → Web | Push on action |
| **Download Stats** | Desktop → Web | Telemetry anonyme opt-in |

### 3.3 Authentication

- **better-auth** (même que le web) → session token stocké dans keychain OS
- Login via OAuth (GitHub, Google) dans une BrowserWindow Electron
- Token refresh automatique
- Mode "Guest" fonctionnel sans compte (pas de sync)

### 3.4 tRPC Client Configuration

```typescript
// Réutilise les mêmes routers que le web
const trpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'https://llmtrust.com/api/trpc',
      headers: () => ({
        Authorization: `Bearer ${getToken()}`
      })
    })
  ]
});
```

**Endpoints réutilisés du web :**
- `models.list`, `models.getById`, `models.getTrending`
- `user.getFavorites`, `user.addFavorite`, `user.removeFavorite`
- `reviews.list`, `reviews.create`
- `auth.getSession`

**Nouveaux endpoints desktop :**
- `desktop.syncHistory` — push historique conversations
- `desktop.reportUsage` — telemetry opt-in

---

## 4. Plan d'Implémentation

### Phase 1 — MVP : Download + Run (4-6 semaines)

**Objectif :** Une app qui peut télécharger un modèle GGUF et générer du texte.

| Semaine | Livrables |
|---------|-----------|
| **1** | Setup projet electron-vite + React + Tailwind + shadcn/ui. Fenêtre principale + sidebar navigation. |
| **2** | Intégration node-llama-cpp. ModelManager : download depuis HuggingFace, stockage local, liste installed. |
| **3** | Chat basique : sélection modèle, load, generate (streaming). Interface minimal. |
| **4** | Settings page (storage path, inference params). Download progress UI. Error handling. |
| **5-6** | Polish, testing, packaging (electron-builder pour macOS/Windows/Linux). |

**Métriques de succès Phase 1 :**
- ✅ Télécharge un modèle GGUF depuis HuggingFace
- ✅ Génère du texte streaming dans une interface chat
- ✅ Fichiers .dmg / .exe / .AppImage buildables
- ✅ App < 200MB (sans modèles)

### Phase 2 — Chat Pro + Multi-Models (3-4 semaines)

| Semaine | Livrables |
|---------|-----------|
| **7** | Multi-conversations (historique, rename, delete). Markdown rendering dans chat. Code highlighting. |
| **8** | Model discovery via API web llmtrust.com. Browse + download depuis l'app. Catalogue cache local (SQLite). |
| **9** | Chat params avancés (system prompt, temperature, context size, stop sequences). GPU auto-detect. |
| **10** | Performance : model hot-swap, memory management, quantization picker. |

### Phase 3 — Sync Web + Community (3-4 semaines)

| Semaine | Livrables |
|---------|-----------|
| **11** | Auth (better-auth), login to llmtrust.com, token management. |
| **12** | Sync favoris, historique conversations → web. Offline-first avec merge strategy. |
| **13** | Community features : rate models, write reviews from desktop, share conversations. |
| **14** | Auto-update (electron-updater), analytics opt-in, crash reporting. Release v1.0. |

---

## 5. Structure du Projet

```
llmtrust-desktop/
├── electron.vite.config.ts        # Config Vite pour 3 processus
├── package.json
├── electron-builder.yml           # Config packaging
├── src/
│   ├── main/                      # Process principal Node.js
│   │   ├── index.ts               # Entry point
│   │   ├── ipc/
│   │   │   ├── models.ts          # Handlers models:download, :list, :delete
│   │   │   ├── inference.ts       # Handlers inference:load, :generate, :stream
│   │   │   ├── sync.ts            # Handlers sync:favorites, :history
│   │   │   └── settings.ts        # Handlers settings:get, :set
│   │   ├── services/
│   │   │   ├── ModelManager.ts    # Download, storage, metadata
│   │   │   ├── InferenceEngine.ts # llama.cpp wrapper
│   │   │   ├── Database.ts        # SQLite (better-sqlite3)
│   │   │   ├── SyncService.ts     # tRPC client, conflict resolution
│   │   │   └── HuggingFaceAPI.ts  # HF Hub integration
│   │   └── utils/
│   │       ├── paths.ts           # app.getPath() helpers
│   │       └── platform.ts        # OS detection, GPU info
│   ├── preload/
│   │   └── index.ts               # contextBridge API exposure
│   ├── renderer/                  # React app
│   │   ├── index.html
│   │   ├── src/
│   │   │   ├── App.tsx
│   │   │   ├── main.tsx
│   │   │   ├── routes/
│   │   │   │   ├── Home.tsx
│   │   │   │   ├── Models.tsx
│   │   │   │   ├── Chat.tsx
│   │   │   │   └── Settings.tsx
│   │   │   ├── components/        # shadcn/ui + custom
│   │   │   │   ├── ui/            # shadcn primitives
│   │   │   │   ├── ModelCard.tsx
│   │   │   │   ├── ChatMessage.tsx
│   │   │   │   ├── ChatInput.tsx
│   │   │   │   ├── DownloadQueue.tsx
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   └── StorageBar.tsx
│   │   │   ├── stores/            # Zustand
│   │   │   │   ├── modelStore.ts
│   │   │   │   ├── chatStore.ts
│   │   │   │   └── settingsStore.ts
│   │   │   ├── hooks/             # Custom hooks
│   │   │   │   ├── useModels.ts
│   │   │   │   ├── useChat.ts
│   │   │   │   └── useSync.ts
│   │   │   ├── lib/               # Utils, trpc client
│   │   │   └── styles/            # Tailwind + theme
│   │   └── electron.d.ts          # Types pour window.llmTrust
│   └── shared/                    # Types partagés main↔renderer
│       ├── models.ts
│       └── ipc.ts
├── resources/                     # Icons, assets
└── scripts/                       # Build helpers
```

---

## 6. Considérations Techniques

### 6.1 Sécurité

- `nodeIntegration: false` + `contextIsolation: true` (par défaut dans electron-vite)
- Pas d'accès direct au filesystem depuis le renderer
- IPC handlers whitelisted (seulement les channels définis)
- CSP strict pour le renderer
- Modèles téléchargés dans le userData sandboxed

### 6.2 Performance

- **Lazy load** des modèles d'inférence : node-llama-cpp chargé uniquement quand on load un modèle
- **GPU acceleration** : détection auto (Metal sur macOS, CUDA sur Windows/Linux, fallback CPU)
- **Memory management** : unload modèle avant d'en charger un autre, garbage collection explicite
- **Worker threads** pour les downloads longs (éviter de bloquer le main process)

### 6.3 Distribution

- **electron-builder** pour packaging multi-platform
- **electron-updater** (auto-update via GitHub Releases — gratuit)
- Code signing : optionnel au début, nécessaire pour éviter les warnings OS
- Targets : macOS (.dmg), Windows (.exe/nsis), Linux (.AppImage)

### 6.4 Dépendances Clés

```json
{
  "dependencies": {
    "electron": "^34",
    "react": "^19",
    "node-llama-cpp": "^3",
    "@huggingface/hub": "^0",
    "better-sqlite3": "^11",
    "@trpc/client": "^11",
    "zustand": "^5",
    "lucide-react": "^0.577",
    "react-router-dom": "^7"
  },
  "devDependencies": {
    "electron-vite": "^2",
    "electron-builder": "^25",
    "typescript": "^5",
    "tailwindcss": "^4",
    "@tailwindcss/vite": "^4"
  }
}
```

---

## 7. Risques & Mitigations

| Risque | Impact | Mitigation |
|--------|--------|------------|
| llama.cpp build native fails on some platforms | Medium | Pré-built binaries via node-llama-cpp, CI matrix testing |
| Gros modèles (> 30GB) échouent download | High | Resume HTTP, chunked download, storage check avant download |
| GPU pas détecté → perf médiocre | Medium | Fallback CPU auto, warning UI, CPU-optimized quantizations |
| tRPC API web change → sync break | Low | Versioned API, backward compat, graceful degradation |
| electron-builder code signing coût | Low | Skip au début, document process pour plus tard |

---

## 8. Métriques & Suivi

### KPIs Phase 1
- Time-to-first-token (load + generate) < 30s
- Download success rate > 95%
- App startup < 3s
- Bundle size < 200MB

### KPIs Phase 2
- Multi-model switch < 10s
- Chat streaming > 20 tokens/s (8B Q4, GPU)
- API response cache hit > 80%

### KPIs Phase 3
- Sync success rate > 99%
- Crash rate < 0.1%
- User retention (7-day) > 40%

---

*⚡ Volt — CroissantLabs Electron Department*
*"On ne ship pas des fenêtres, on ship des expériences."*
