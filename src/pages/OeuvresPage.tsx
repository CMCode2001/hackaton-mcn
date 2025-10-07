import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  Float,
  Html,
  Environment,
  Stars,
  useTexture,
} from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import {
  DoorOpen,
  Map as MapIcon,
  X,
  ArrowLeft,
  Home,
  Map,
  Volume2,
  Building,
  Globe,
  Users,
  GalleryVertical,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

// ---- Assets ----
import hallMusee from "../assets/img/hallMusee.jpg";
import niveau1 from "../assets/img/niveau1.jpg";
import niveau2 from "../assets/img/niveau2.jpg";
import niveau3 from "../assets/img/niveau3.jpg";
import backgroundAudio from "../assets/media/african_ambience.mp3";

// ------------------ CONFIG AMÉLIORÉ ------------------
const ROOM_CONFIG = {
  entrance: {
    name: "Hall Principal",
    description: "Bienvenue au Musée des Civilisations Noires",
    artworks: [],
    center: [0, 1.2, 0],
    cameraPos: [0, 2.6, 10], // Camera plus éloignée
    size: [25, 8, 15], // Salle plus grande
    color: "#1a120b",
    ambientColor: "#D4AF37",
    doors: [
      {
        position: [-3, 1.5, 2], // Beaucoup plus éloigné
        target: "niveau1",
        label: "Niveau 1 - Les Origines",
        icon: "🏺",
        description: "Des origines à l'antiquité",
      },
      {
        position: [1, 1.5, -3], // Beaucoup plus éloigné
        target: "niveau2",
        label: "Niveau 2 - Les Civilisations",
        icon: "🕌",
        description: "Empires et cultures médiévales",
      },
      {
        position: [3, 1.5, 4], // Beaucoup plus éloigné
        target: "niveau3",
        label: "Niveau 3 - Les Diasporas",
        icon: "⛓",
        description: "De la traite aux indépendances",
      },
    ],
  },

  // NIVEAU 1 - LES ORIGINES
  niveau1: {
    name: "Niveau 1 - Les Origines",
    description: "Des origines de l'humanité aux grands royaumes antiques",
    center: [0, 1.6, 0],
    cameraPos: [0, 2.4, 8],
    size: [18, 6, 12],
    color: "#2d1b0e",
    ambientColor: "#8B4513",
    artworks: [ // Œuvres directement dans le niveau
      {
        id: "origines-africaines",
        title: "Les Origines Africaines",
        img: "/images/niveau1/galerie-homme-noir.jpg",
        description: "Berceau de l'humanité et diversité génétique des populations noires",
        position: [-3, 1.5, 5],
        category: "Anthropologie"
      },
      {
        id: "art-rupestre",
        title: "Art Rupestre du Sahara",
        img: "/images/niveau1/galerie-prehistoire.jpg",
        description: "Peintures rupestres du Tassili n'Ajjer témoignant des premières expressions artistiques",
        position: [-1, 1.5, 2],
        category: "Préhistoire"
      },
      {
        id: "pharaons-noirs",
        title: "Les Pharaons Noirs",
        img: "/images/niveau1/galerie-royaumes.jpg",
        description: "XXVe dynastie égyptienne et royaume de Koush : l'âge d'or des civilisations nilotiques",
        position: [2, 1.5, 4],
        category: "Archéologie"
      },
    ]
  },

  // NIVEAU 2 - LES CIVILISATIONS
  niveau2: {
    name: "Niveau 2 - Les Civilisations",
    description: "Grands empires et développements culturels médiévaux",
    center: [0, 1.6, 0],
    cameraPos: [0, 2.4, 8],
    size: [18, 6, 12],
    color: "#251a0f",
    ambientColor: "#CD7F32",
    artworks: [
      {
        id: "mali-empire",
        title: "Empire du Mali",
        img: "/images/niveau2/galerie-empires.jpg",
        description: "L'âge d'or de l'Afrique de l'Ouest sous Mansa Moussa et l'apogée du commerce transsaharien",
        position: [-3, 1.5, 5],
        category: "Histoire"
      },
      {
        id: "bronze-ife",
        title: "Bronzes d'Ife et Art Bénin",
        img: "/images/niveau2/galerie-arts.jpg",
        description: "Sculptures en bronze du royaume d'Ife et techniques métallurgiques avancées",
        position: [-1, 1.5, 2],
        category: "Art"
      },
      {
        id: "spiritualite-africaine",
        title: "Spiritualités Africaines",
        img: "/images/niveau2/galerie-spiritualites.jpg",
        description: "Diversité des croyances et pratiques religieuses à travers les âges",
        position: [2, 1.5, 4],
        category: "Religion"
      },
    ]
  },

  // NIVEAU 3 - LES DIASPORAS
  niveau3: {
    name: "Niveau 3 - Les Diasporas",
    description: "Traites négrières, résistances et constructions contemporaines",
    center: [0, 1.6, 0],
    cameraPos: [0, 2.4, 8],
    size: [18, 6, 12],
    color: "#1f170d",
    ambientColor: "#D2691E",
    artworks: [
      {
        id: "memoire-traite",
        title: "Mémoire de la Traite",
        img: "/images/niveau3/galerie-traite.jpeg",
        description: "Histoire et mémoire des traites négrières et leurs impacts durables",
        position: [-3, 1.5, 5],
        category: "Histoire"
      },
      {
        id: "resistances",
        title: "Histoires de Résistance",
        img: "/images/niveau3/galerie-resistances.jpg",
        description: "Luttes pour la liberté et la dignité à travers les siècles",
         position: [-1, 1.5, 2],
        category: "Résistance"
      },
      {
        id: "independances",
        title: "Ère des Indépendances",
        img: "/images/niveau3/galerie-independances.jpg",
        description: "De Kwame Nkrumah à l'Union Africaine : la longue marche vers la souveraineté",
        position: [2, 1.5, 4],
        category: "Politique"
      },
    ]
  },
};

// ------------------ SafeImage Component ------------------
function SafeImage({ src, alt, fallbackEmoji, className }: { 
  src: string; 
  alt: string; 
  fallbackEmoji: string;
  className: string;
}) {
  const [imgError, setImgError] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleError = () => {
    console.warn(`Image non trouvée: ${src}`);
    setImgError(true);
    setLoading(false);
  };

  const handleLoad = () => {
    setLoading(false);
  };

  if (imgError) {
    return (
      <div className={`${className} bg-gradient-to-br from-[#2d1b0e] to-[#3a2715] flex items-center justify-center border-2 border-dashed border-[#D4AF37]/40 rounded-lg`}>
        <div className="text-center text-[#C6B897] p-4">
          <div className="text-4xl mb-2">{fallbackEmoji}</div>
          <div className="text-sm font-medium">{alt}</div>
          <div className="text-xs mt-2 text-[#D4AF37]">Œuvre à venir</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {loading && (
        <div className={`${className} bg-[#2d1b0e] animate-pulse flex items-center justify-center absolute inset-0 rounded-lg`}>
          <div className="text-[#D4AF37] text-sm flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
            Chargement...
          </div>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`${className} ${loading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300 rounded-lg`}
        onError={handleError}
        onLoad={handleLoad}
        loading="lazy"
      />
    </div>
  );
}

// ------------------ Floating Door ------------------
function FloatingDoor({
  door,
  onSelect,
}: {
  door: any;
  onSelect: (d: any) => void;
}) {
  const ref = useRef<any>(null);
  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.002;
      ref.current.position.y = door.position[1] + Math.sin(Date.now() * 0.001) * 0.15;
    }
  });

  return (
    <Float speed={1.2} rotationIntensity={0.4} floatIntensity={0.6}>
      <group ref={ref} position={door.position}>
        <Html center distanceFactor={12} zIndexRange={[100, 0]}>
          <motion.button
            onClick={() => onSelect(door)}
            whileHover={{ scale: 1.15, y: -8 }}
            className="bg-gradient-to-br from-black/90 to-[#1a120b] backdrop-blur-xl border-2 border-[#D4AF37] rounded-2xl p-6 text-white font-semibold transition-all duration-300 hover:shadow-2xl hover:shadow-[#D4AF37]/30 group min-w-[200px]"
          >
            <div className="text-center">
              <div className="text-5xl mb-3 group-hover:scale-110 transition-transform duration-300">
                {door.icon}
              </div>
              <div className="text-[#D4AF37] font-bold text-xl mb-2">
                {door.label}
              </div>
              <div className="text-[#C6B897] text-sm leading-tight">
                {door.description}
              </div>
              <div className="mt-3 text-xs text-[#D4AF37] bg-[#D4AF37]/10 rounded-full px-3 py-1 inline-block">
                Entrer ›
              </div>
            </div>
          </motion.button>
        </Html>
      </group>
    </Float>
  );
}

// ------------------ Floating Artwork AMÉLIORÉ ------------------
function FloatingArtwork({
  art,
  onSelect,
}: {
  art: any;
  onSelect: (a: any) => void;
}) {
  const ref = useRef<any>(null);
  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.004;
      ref.current.position.y = art.position[1] + Math.sin(Date.now() * 0.001 + art.id.length) * 0.12;
    }
  });

  return (
    <Float speed={0.8} rotationIntensity={0.5} floatIntensity={0.5}>
      <group ref={ref} position={art.position}>
        <Html center distanceFactor={6} zIndexRange={[90, 0]}>
          <motion.div
            onClick={() => onSelect(art)}
            whileHover={{ scale: 1.08, y: -6 }}
            className="w-80 bg-gradient-to-br from-black/90 to-[#1a120b] border-2 border-[#D4AF37]/50 rounded-2xl overflow-hidden cursor-pointer shadow-2xl backdrop-blur-lg"
          >
            <SafeImage
              src={art.img}
              alt={art.title}
              fallbackEmoji="🖼️"
              className="w-full h-44 object-cover"
            />
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-[#D4AF37] font-bold text-lg leading-tight flex-1">
                  {art.title}
                </h3>
                <span className="text-xs text-[#C6B897] bg-[#D4AF37]/10 rounded-full px-2 py-1 ml-2 whitespace-nowrap">
                  {art.category}
                </span>
              </div>
              <p className="text-[#C6B897] text-sm leading-relaxed line-clamp-3">
                {art.description}
              </p>
              <div className="mt-3 text-xs text-[#D4AF37] text-center">
                Cliquer pour explorer ›
              </div>
            </div>
          </motion.div>
        </Html>
      </group>
    </Float>
  );
}

// ------------------ Modal AMÉLIORÉ ------------------
function ArtworkModal({
  artwork,
  onClose,
}: {
  artwork: any;
  onClose: () => void;
}) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        className="bg-gradient-to-br from-[#1a120b] to-[#2d1b0e] rounded-2xl overflow-hidden max-w-4xl w-full shadow-2xl border-2 border-[#D4AF37]/30"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
      >
        <div className="flex gap-6 p-8">
          <div className="w-64 h-64 rounded-xl overflow-hidden border-2 border-[#D4AF37]/30 bg-[#2d1b0e]">
            <SafeImage
              src={artwork.img}
              alt={artwork.title}
              fallbackEmoji="🖼️"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-[#D4AF37] text-3xl font-bold leading-tight">
                {artwork.title}
              </h2>
              <button 
                onClick={onClose} 
                className="text-[#D4AF37] hover:text-white transition-colors p-2 hover:bg-[#D4AF37]/10 rounded-lg"
              >
                <X size={24} />
              </button>
            </div>
            
            {artwork.category && (
              <div className="inline-block text-sm text-[#C6B897] bg-[#D4AF37]/10 rounded-full px-3 py-1 mb-4">
                {artwork.category}
              </div>
            )}
            
            <p className="text-[#C6B897] text-lg leading-relaxed mb-6">
              {artwork.description}
            </p>
            
            <button
              onClick={onClose}
              className="px-6 py-3 bg-[#D4AF37]/20 text-[#D4AF37] rounded-lg hover:bg-[#D4AF37]/30 transition-colors border border-[#D4AF37]/30 font-semibold"
            >
              Fermer
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ------------------ Scene AMÉLIORÉE ------------------
function Scene({
  currentRoom,
  onSelectArtwork,
  onSelectGallery,
}: {
  currentRoom: string;
  onSelectArtwork: (a: any) => void;
  onSelectGallery: (g: any) => void;
}) {
  const { camera } = useThree();
  const controls = useRef<any>(null);
  const targetPos = useRef(
    new THREE.Vector3(...ROOM_CONFIG[currentRoom].cameraPos)
  );
  const targetLook = useRef(
    new THREE.Vector3(...ROOM_CONFIG[currentRoom].center)
  );

  useFrame(() => {
    camera.position.lerp(targetPos.current, 0.08);
    controls.current?.target.lerp(targetLook.current, 0.08);
    controls.current?.update();
  });

  const room = ROOM_CONFIG[currentRoom];
  const texture = useTexture(
    currentRoom === "entrance"
      ? hallMusee
      : currentRoom === "niveau1"
      ? niveau1
      : currentRoom === "niveau2"
      ? niveau2
      : niveau3
  );

  return (
    <>
      <Environment preset="sunset" />
      <ambientLight intensity={0.4} color={room.ambientColor} />
      <pointLight position={[0, 3, 0]} intensity={0.4} color="#D4AF37" />
      <pointLight position={[5, 3, 5]} intensity={0.3} color="#8B4513" />
      <pointLight position={[-5, 3, -5]} intensity={0.3} color="#CD7F32" />

      {/* Sol */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <planeGeometry args={[room.size[0], room.size[2]]} />
        <meshStandardMaterial color={room.color} roughness={0.9} />
      </mesh>

      {/* Mur du fond avec texture */}
      <mesh position={[0, room.size[1] / 2, -room.size[2] / 2]}>
        <planeGeometry args={[room.size[0], room.size[1]]} />
        <meshStandardMaterial map={texture} />
      </mesh>

      {/* Murs latéraux */}
      <mesh position={[-room.size[0] / 2, room.size[1] / 2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[room.size[2], room.size[1]]} />
        <meshStandardMaterial color={room.color} />
      </mesh>
      <mesh position={[room.size[0] / 2, room.size[1] / 2, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[room.size[2], room.size[1]]} />
        <meshStandardMaterial color={room.color} />
      </mesh>
      <mesh position={[0, room.size[1] / 2, room.size[2] / 2]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[room.size[0], room.size[1]]} />
        <meshStandardMaterial color={room.color} />
      </mesh>

      {/* Plafond */}
      <mesh position={[0, room.size[1], 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[room.size[0], room.size[2]]} />
        <meshStandardMaterial color="#0f0a03" />
      </mesh>

      {/* Portes dans le hall - POSITIONS CORRIGÉES */}
      {currentRoom === "entrance" &&
        room.doors?.map((door) => (
          <FloatingDoor
            key={door.target}
            door={door}
            onSelect={onSelectGallery}
          />
        ))}

      {/* Œuvres dans les niveaux - 3 ŒUVRES MAX */}
      {room.artworks?.slice(0, 3).map((artwork) => (
        <FloatingArtwork
          key={artwork.id}
          art={artwork}
          onSelect={onSelectArtwork}
        />
      ))}

      {/* Contrôles caméra 360° complets */}
      <OrbitControls
        ref={controls}
        enableZoom={true}
        enablePan={true}
        enableRotate={true}
        autoRotate={currentRoom === "entrance"}
        autoRotateSpeed={0.3}
        minDistance={3}
        maxDistance={25}
        minPolarAngle={0}
        maxPolarAngle={Math.PI}
        rotateSpeed={0.5}
        zoomSpeed={0.8}
        panSpeed={0.5}
      />
      
      <Stars radius={100} depth={50} count={500} factor={4} fade speed={0.5} />
    </>
  );
}

// ------------------ Main Page CORRIGÉE ------------------
export function OeuvresPage() {
  const [currentRoom, setCurrentRoom] = useState("entrance");
  const [selectedArtwork, setSelectedArtwork] = useState<any | null>(null);
  const [showMap, setShowMap] = useState(true);
  const [playing, setPlaying] = useState(true); // Son activé par défaut
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { t } = useTranslation();

  // Initialisation de l'audio - DÉMARRAGE AUTOMATIQUE
  useEffect(() => {
    const initializeAudio = async () => {
      try {
        audioRef.current = new Audio(backgroundAudio);
        audioRef.current.loop = true;
        audioRef.current.volume = 0.25;
        
        // Démarrer automatiquement
        await audioRef.current.play();
        setPlaying(true);
      } catch (err) {
        console.warn("Lecture audio automatique bloquée:", err);
        // L'audio sera joué au premier clic utilisateur
      }
    };

    initializeAudio();

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const toggleSound = async () => {
    if (!audioRef.current) return;
    
    try {
      if (playing) {
        audioRef.current.pause();
        setPlaying(false);
      } else {
        // Si l'audio n'a pas encore été joué, on le charge
        if (audioRef.current.currentTime === 0) {
          audioRef.current.volume = 0.25;
        }
        await audioRef.current.play();
        setPlaying(true);
      }
    } catch (err) {
      console.warn("Erreur de lecture audio:", err);
    }
  };

  const goToEntrance = () => setCurrentRoom("entrance");

  const handleSelectGallery = (gallery: any) => {
    if (gallery.id && ROOM_CONFIG[gallery.id]) {
      setCurrentRoom(gallery.id);
    }
  };

  return (
    <div className="h-screen w-full flex bg-[#0A0603] text-white">
      {/* 3D */}
      <div className="flex-1 relative">
        <Canvas
          camera={{ position: ROOM_CONFIG[currentRoom].cameraPos, fov: 60 }}
          gl={{ antialias: true }}
        >
          <Scene
            currentRoom={currentRoom}
            onSelectArtwork={setSelectedArtwork}
            onSelectGallery={handleSelectGallery}
          />
        </Canvas>

        {/* -------- TOP CONTROLS -------- */}
        <div className="absolute z-50 top-6 left-6 flex gap-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[#D4AF37] hover:text-white transition-colors duration-300 p-2 rounded-lg hover:bg-[#D4AF37]/10 backdrop-blur-sm border border-[#D4AF37]/20"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">
              {t("oeuvres.back") || "Retour"}
            </span>
          </Link>

          {currentRoom !== "entrance" && (
            <button
              onClick={goToEntrance}
              className="inline-flex items-center gap-2 text-[#D4AF37] hover:text-white transition-colors duration-300 p-2 rounded-lg hover:bg-[#D4AF37]/10 backdrop-blur-sm border border-[#D4AF37]/20"
            >
              <Home className="w-5 h-5" />
              <span className="hidden sm:inline">Hall Principal</span>
            </button>
          )}
        </div>

        <div className="absolute z-50 top-6 right-6 flex gap-4">
          <button
            onClick={() => setShowMap(!showMap)}
            className="text-[#D4AF37] hover:text-white transition-colors duration-300 p-2 rounded-lg hover:bg-[#D4AF37]/10 backdrop-blur-sm border border-[#D4AF37]/20"
          >
            <Map className="w-5 h-5" />
          </button>

          <button
            onClick={toggleSound}
            className={`transition-colors duration-300 p-2 rounded-lg backdrop-blur-sm border ${
              playing 
                ? "text-green-400 hover:text-green-300 border-green-400/30 hover:bg-green-400/10" 
                : "text-[#D4AF37] hover:text-white border-[#D4AF37]/20 hover:bg-[#D4AF37]/10"
            }`}
          >
            <Volume2 className="w-5 h-5" />
          </button>
        </div>

        {/* Indicateur de salle */}
        <div className="absolute z-40 left-1/2 top-6 -translate-x-1/2">
          <motion.div
            className="bg-black/60 backdrop-blur-md border border-[#D4AF37]/30 rounded-full px-6 py-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="text-[#D4AF37] font-semibold text-sm">
              {ROOM_CONFIG[currentRoom]?.name || "Hall Principal"}
            </span>
          </motion.div>
        </div>

        {/* Description du niveau */}
        {currentRoom !== "entrance" && (
          <div className="absolute z-40 left-1/2 top-20 -translate-x-1/2 text-center">
            <motion.p
              className="text-[#C6B897] text-sm max-w-2xl bg-black/40 backdrop-blur-sm rounded-full px-4 py-2 border border-[#D4AF37]/20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {ROOM_CONFIG[currentRoom]?.description}
            </motion.p>
          </div>
        )}

        {/* Titre central */}
        <div className="absolute z-40 left-1/2 top-24 -translate-x-1/2 text-center pointer-events-none px-4 w-full max-w-6xl">
          <motion.h1
            className="text-3xl md:text-5xl lg:text-6xl font-bold text-[#D4AF37] drop-shadow-[0_0_25px_rgba(212,175,55,0.6)]"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {t("oeuvres.title") || "Musée des Civilisations Noires"}
          </motion.h1>
          <motion.p
            className="mt-3 text-[#C6B897] max-w-2xl mx-auto text-sm md:text-base"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {t("oeuvres.subtitle") ||
              "Parcourez l'histoire et l'héritage des civilisations noires"}
          </motion.p>
        </div>

        {/* Mini carte - Z-INDEX ÉLEVÉ */}
        {showMap && (
          <motion.div
            className="absolute top-24 right-6 bg-black/80 backdrop-blur-md border border-[#D4AF37]/30 rounded-xl p-6 max-w-sm w-[330px] z-40"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h3 className="text-[#D4AF37] font-bold text-lg mb-4 flex items-center gap-2">
              <MapIcon className="w-5 h-5" /> Plan du Musée
            </h3>

            <div className="space-y-3">
              {Object.entries(ROOM_CONFIG).map(([key, room]) => (
                <button
                  key={key}
                  onClick={() => setCurrentRoom(key)}
                  className={`w-full text-left p-3 rounded-lg transition-all duration-300 border ${
                    currentRoom === key
                      ? "bg-[#D4AF37]/20 border-[#D4AF37] transform scale-105"
                      : "bg-[#D4AF37]/10 border-[#D4AF37]/20 hover:bg-[#D4AF37]/20"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        currentRoom === key
                          ? "bg-[#D4AF37] text-black"
                          : "bg-[#D4AF37]/20 text-[#D4AF37]"
                      }`}
                    >
                      {key === "entrance" ? (
                        <Building className="w-4 h-4" />
                      ) : key === "niveau1" ? (
                        <Globe className="w-4 h-4" />
                      ) : key === "niveau2" ? (
                        <GalleryVertical className="w-4 h-4" />
                      ) : (
                        <Users className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <p className="text-white font-medium">{room.name}</p>
                      <p className="text-[#C6B897] text-sm">
                        {room.artworks 
                          ? `${room.artworks.length} œuvre(s)` 
                          : `${room.doors?.length || 0} niveau(x)`}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
              
              {/* Instructions */}
              <div className="mt-6 p-4 bg-[#D4AF37]/10 rounded-lg border border-[#D4AF37]/20">
                <h4 className="text-[#D4AF37] font-semibold text-sm mb-2">
                  Comment naviguer :
                </h4>
                <ul className="text-[#C6B897] text-xs space-y-1">
                  <li>• <kbd className="bg-[#D4AF37]/20 px-1 rounded">Souris</kbd> Tourner la vue 360°</li>
                  <li>• <kbd className="bg-[#D4AF37]/20 px-1 rounded">Molette</kbd> Zoomer</li>
                  <li>• <kbd className="bg-[#D4AF37]/20 px-1 rounded">Clic</kbd> Sélectionner</li>
                  <li>• <kbd className="bg-[#D4AF37]/20 px-1 rounded">Espace</kbd> Pause/Play rotation</li>
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedArtwork && (
          <ArtworkModal
            artwork={selectedArtwork}
            onClose={() => setSelectedArtwork(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}