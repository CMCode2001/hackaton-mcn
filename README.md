# Musée Virtuel - PWA

Application Progressive Web App (PWA) pour découvrir les œuvres d'art d'un musée via QR codes avec descriptions multilingues (Français, Anglais, Wolof), audio, vidéo et modèles 3D.

## 🚀 Technologies

- **React 18** - Framework UI
- **TypeScript** - Typage statique
- **Vite 5** - Build tool et dev server
- **Tailwind CSS** - Styling moderne et responsive
- **React Router v6** - Navigation SPA
- **i18next** - Internationalisation (FR/EN/WO)
- **Three.js / @react-three/fiber** - Visualisation 3D
- **Howler.js** - Lecture audio
- **@zxing/library** - Scan QR codes
- **vite-plugin-pwa** - Configuration PWA avec Workbox

## 📦 Installation

```bash
# Installer les dépendances
npm install
```

## 🛠️ Scripts disponibles

```bash
# Développement (hot reload)
npm run dev

# Build production
npm run build

# Preview du build
npm run preview

# Lint
npm run lint

# Type check
npm run typecheck
```

## 📁 Structure du projet

```
src/
├── api/              # Wrapper API et appels HTTP
│   └── api.ts
├── components/       # Composants réutilisables
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── QRCodeScanner.tsx
│   ├── AudioPlayer.tsx
│   ├── VideoPlayer.tsx
│   └── Model3DViewer.tsx
├── hooks/            # Hooks personnalisés
│   └── useFetch.ts
├── locales/          # Fichiers de traduction i18next
│   ├── fr.json
│   ├── en.json
│   └── wo.json
├── pages/            # Pages/Routes principales
│   ├── Home.tsx
│   ├── OeuvresList.tsx
│   ├── OeuvreDetail.tsx
│   ├── ScanPage.tsx
│   └── About.tsx
├── types/            # Types TypeScript
│   └── models.ts
├── App.tsx           # Composant racine avec routing
├── main.tsx          # Point d'entrée React
├── i18n.ts           # Configuration i18next
└── index.css         # Styles globaux

public/
├── data/             # Dataset de démonstration
│   └── oeuvres.json
├── icon-192.png      # Icône PWA 192x192
└── icon-512.png      # Icône PWA 512x512
```

## 🌐 API Backend attendue

L'application peut fonctionner avec un backend ou en mode démo local (public/data/oeuvres.json).

### Endpoints API (optionnel)

```
GET /api/oeuvres
→ Retourne un tableau d'objets Oeuvre

GET /api/oeuvres/:id
→ Retourne un objet Oeuvre par son ID

GET /api/oeuvres/qr/:qrCodeRef
→ Retourne un objet Oeuvre par son QR code
```

### Format Oeuvre

```typescript
interface Oeuvre {
  id: string;
  qrCodeRef: string;
  titre: string;
  auteur: string;
  dateCreation: string;
  localisationMusee: string;
  modele3dUrl?: string;
  imageUrl?: string;
  descriptions: DescriptionMultilingue[];
}

interface DescriptionMultilingue {
  id: string;
  langue: 'fr' | 'en' | 'wo';
  texteComplet: string;
  audioUrl?: string;
  videoUrl?: string;
  historiqueEtContexte?: string;
}
