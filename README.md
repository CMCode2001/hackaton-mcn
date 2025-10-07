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
```

## 📱 Fonctionnalités PWA

- ✅ Installation sur mobile et desktop
- ✅ Mode offline (cache des assets et données)
- ✅ Cache des médias (images, audio, vidéo, modèles 3D)
- ✅ Service Worker avec stratégies Workbox
- ✅ Manifest avec icônes et métadonnées
- ✅ Auto-update du service worker

### Stratégies de cache

- **Assets statiques** : Precache (JS, CSS, HTML)
- **Images/Audio/Vidéo/3D** : CacheFirst (30 jours)
- **API calls** : StaleWhileRevalidate (24h)

## 🎨 Fonctionnalités principales

### 1. Scanner QR Code
- Accès caméra avec gestion des permissions
- Lecture automatique des QR codes
- Fallback saisie manuelle
- Redirection vers la fiche œuvre

### 2. Visualisation des œuvres
- Liste responsive avec images
- Détails complets de chaque œuvre
- Changement de langue dynamique
- Descriptions textuelles complètes

### 3. Médias enrichis
- **Audio** : Lecteur Howler.js avec contrôles volume
- **Vidéo** : Player HTML5 natif responsive
- **3D** : Viewer Three.js avec OrbitControls tactiles

### 4. Multilingue
- Français (FR)
- English (EN)
- Wolof (WO)
- Persistance du choix (localStorage)
- Interface complète traduite

## 🚢 Déploiement

### Netlify

```bash
# Build
npm run build

# Déployer le dossier dist/
# ou connecter le repo GitHub à Netlify
```

Configuration netlify.toml :

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Vercel

```bash
# Installer Vercel CLI
npm i -g vercel

# Build et déployer
vercel --prod
```

Configuration vercel.json :

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

## 🔧 Configuration environnement

Créer un fichier `.env` à la racine :

```bash
VITE_API_URL=https://votre-api.com/api
```

Si aucune API backend n'est disponible, l'app utilisera les données de démonstration dans `public/data/oeuvres.json`.

## 🌍 Ajouter une langue

1. Créer `src/locales/nouvelle-langue.json`
2. Copier la structure de `fr.json`
3. Traduire toutes les clés
4. Importer dans `src/i18n.ts` :

```typescript
import nouvelleLangueTranslations from './locales/nouvelle-langue.json';

// Ajouter dans resources
resources: {
  // ...
  'nouvelle-langue': { translation: nouvelleLangueTranslations },
}
```

5. Ajouter le sélecteur dans `Header.tsx`

## 📝 Dataset de démonstration

Le fichier `public/data/oeuvres.json` contient 3 œuvres exemples avec :
- Descriptions trilingues
- URLs de médias de test (audio, vidéo)
- URLs de modèles 3D (glTF samples)
- Images Pexels

Pour utiliser vos propres œuvres, remplacez ce fichier ou configurez votre API backend.

## 🔐 Permissions requises

- **Caméra** : pour scanner les QR codes
- **Stockage** : localStorage pour langue et service worker cache

## 🐛 Troubleshooting

### Caméra ne s'ouvre pas
- Vérifier les permissions du navigateur
- Tester sur HTTPS (requis pour camera API)
- Utiliser la saisie manuelle en fallback

### Modèle 3D ne charge pas
- Vérifier l'URL du modèle .gltf/.glb
- Tester le support WebGL du navigateur
- Voir la console pour les erreurs CORS

### Audio ne joue pas
- Vérifier l'URL audio
- Tester le format (MP3 recommandé)
- Vérifier les autorisations autoplay du navigateur

## 📄 License

MIT

## 👥 Contribution

Les contributions sont les bienvenues ! Ouvrir une issue ou PR sur GitHub.

---

Créé avec ❤️ pour le Musée Virtuel
# hackaton-mcn
