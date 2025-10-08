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
  ArrowLeft,
  Home,
  Map,
  Volume2,
  Building,
  Globe,
  Users,
  GalleryVertical,
  X,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
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
        position: [-4, 1.5, 2],
        target: "niveau1",
        label: " Les Origines",
        icon: "🏺",
        description: "Des origines à l'antiquité",
      },
      {
        position: [0, 1.5, 0],
        target: "niveau2",
        label: "Les Civilisations",
        icon: "🕌",
        description: "Empires et cultures médiévales",
      },
      {
        position: [4, 1.5, 2],
        target: "niveau3",
        label: " Les Diasporas",
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
      ref.current.position.y = door.position[1] + Math.sin(Date.now() * 0.001) * 0.1;
    }
  });

  return (
    <Float speed={1} rotationIntensity={0.2} floatIntensity={0.4}>
      <group ref={ref} position={door.position}>
        <Html center distanceFactor={10} zIndexRange={[100, 0]}>
          <motion.button
            onClick={() => onSelect(door)}
            whileHover={{ scale: 1.1, y: -10 }}
            className="bg-black/50 backdrop-blur-md border border-[#D4AF37]/30 rounded-2xl text-white transition-all duration-300 hover:shadow-lg hover:shadow-[#D4AF37]/20 hover:border-[#D4AF37]/60 group w-52 sm:w-[240px] overflow-hidden"
          >
            <div className="p-5 text-center">
              <div className="text-5xl bg-black/40 p-4 rounded-full inline-block text-[#D4AF37] group-hover:scale-110 transition-transform duration-300">
                {door.icon}
              </div>
              <div className="mt-4">
                <div className="text-[#D4AF37] font-bold text-xl mb-1">
                  {door.label}
                </div>
                <div className="text-[#C6B897] text-sm leading-snug px-2">
                  {door.description}
                </div>
              </div>
            </div>
            <div className="mt-1 text-sm font-semibold text-center text-black bg-[#D4AF37] py-2 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
              Explorer le Niveau
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
            className="w-64 sm:w-72 lg:w-80 bg-gradient-to-br from-black/90 to-[#1a120b] border-2 border-[#D4AF37]/50 rounded-2xl overflow-hidden cursor-pointer shadow-2xl backdrop-blur-lg"
          >
            <SafeImage
              src={art.img}
              alt={art.title}
              fallbackEmoji="🖼️"
              className="w-full h-36 sm:h-44 object-cover"
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

const useIsMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < breakpoint);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoint]);

  return isMobile;
};

function OeuvresPage2D() {
  const [currentRoom, setCurrentRoom] = useState("entrance");
  const { t } = useTranslation();
  const navigate = useNavigate();
  const room = ROOM_CONFIG[currentRoom];

  const handleSelectArtwork = (artwork: any) => {
    if (artwork.id) {
      navigate(`/oeuvres/${artwork.id}`);
    }
  };

  return (
    <div className="h-screen w-full bg-[#0A0603] text-white overflow-y-auto p-4 sm:p-6">
      <div className="absolute top-6 left-6">
        <Link to="/" className="inline-flex items-center gap-2 text-[#D4AF37] hover:text-white transition-colors duration-300 p-2 rounded-lg hover:bg-[#D4AF37]/10">
          <ArrowLeft className="w-5 h-5" />
          <span>{t("oeuvres.back") || "Retour"}</span>
        </Link>
      </div>

      <div className="text-center my-16">
        <h1 className="text-4xl font-bold text-[#D4AF37]">{t("oeuvres.title") || "Musée des Civilisations Noires"}</h1>
        <p className="mt-2 text-[#C6B897] max-w-2xl mx-auto">{t("oeuvres.subtitle") || "Parcourez l'histoire et l'héritage des civilisations noires"}</p>
      </div>

      {currentRoom !== "entrance" && (
        <div className="mb-6">
          <button
            onClick={() => setCurrentRoom("entrance")}
            className="inline-flex items-center gap-2 text-[#D4AF37] hover:text-white transition-colors duration-300 p-2 rounded-lg hover:bg-[#D4AF37]/10 backdrop-blur-sm border border-[#D4AF37]/20"
          >
            <Home className="w-5 h-5" />
            <span>Hall Principal</span>
          </button>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-[#D4AF37] mb-2">{room.name}</h2>
        <p className="text-[#C6B897] mb-8">{room.description}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {currentRoom === "entrance" ? (
            room.doors?.map((door) => (
              <div key={door.target} onClick={() => setCurrentRoom(door.target)} className="bg-black/50 backdrop-blur-md border border-[#D4AF37]/30 rounded-2xl text-white transition-all duration-300 hover:shadow-lg hover:shadow-[#D4AF37]/20 hover:border-[#D4AF37]/60 p-6 cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="text-4xl bg-black/40 p-3 rounded-full inline-block text-[#D4AF37]">
                    {door.icon}
                  </div>
                  <div>
                    <h3 className="text-[#D4AF37] font-bold text-xl">{door.label}</h3>
                    <p className="text-[#C6B897] text-sm">{door.description}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            room.artworks?.map((art) => (
              <div key={art.id} onClick={() => handleSelectArtwork(art)} className="bg-gradient-to-br from-black/90 to-[#1a120b] border-2 border-[#D4AF37]/50 rounded-2xl overflow-hidden cursor-pointer shadow-2xl">
                <SafeImage src={art.img} alt={art.title} fallbackEmoji="🖼️" className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="text-[#D4AF37] font-bold text-lg">{art.title}</h3>
                  <p className="text-[#C6B897] text-sm mt-1 line-clamp-2">{art.description}</p>
                  <span className="text-xs text-[#C6B897] bg-[#D4AF37]/10 rounded-full px-2 py-1 mt-2 inline-block">{art.category}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// ------------------ Main Page CORRIGÉE ------------------
export function OeuvresPage() {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <OeuvresPage2D />;
  }

  const [currentRoom, setCurrentRoom] = useState("entrance");
  
  const [showMap, setShowMap] = useState(false);
  const [playing, setPlaying] = useState(true); // Son activé par défaut
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { t } = useTranslation();
  const navigate = useNavigate();

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
    if (gallery.target && ROOM_CONFIG[gallery.target]) {
      setCurrentRoom(gallery.target);
    }
  };

  const handleSelectArtwork = (artwork: any) => {
    if (artwork.id) {
      navigate(`/oeuvres/${artwork.id}`);
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
            onSelectArtwork={handleSelectArtwork}
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
          <div className="absolute z-40 left-1/2 top-24 sm:top-20 -translate-x-1/2 text-center px-4 w-full">
            <motion.p
              className="text-[#C6B897] text-xs sm:text-sm max-w-2xl bg-black/40 backdrop-blur-sm rounded-full px-4 py-2 border border-[#D4AF37]/20 inline-block"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {ROOM_CONFIG[currentRoom]?.description}
            </motion.p>
          </div>
        )}

        {/* Titre central */}
        <div className="absolute z-40 left-1/2 top-36 sm:top-24 -translate-x-1/2 text-center pointer-events-none px-4 w-full max-w-6xl">
          <motion.h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#D4AF37] drop-shadow-[0_0_25px_rgba(212,175,55,0.6)]"
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
        <AnimatePresence>
        {showMap && (
          <motion.div
            key="map-modal"
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl p-4 flex flex-col sm:absolute sm:inset-auto sm:top-24 sm:right-6 sm:w-[330px] sm:max-w-sm sm:bg-black/80 sm:rounded-xl sm:p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[#D4AF37] font-bold text-lg flex items-center gap-2">
                <MapIcon className="w-5 h-5" /> Plan du Musée
              </h3>
              <button onClick={() => setShowMap(false)} className="sm:hidden text-[#D4AF37] hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-3 overflow-y-auto">
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
        </AnimatePresence>
      </div>

      
    </div>
  );
}