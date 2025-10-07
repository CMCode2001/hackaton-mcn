// src/pages/OeuvreDetailPage.tsx
import React, { useEffect, useState, useRef, Suspense } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { ArrowLeft, Volume2, Play, RotateCcw, X } from "lucide-react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF, Html } from "@react-three/drei";
import * as THREE from "three";

/**
 * Page de détail d'une œuvre
 * - Charge /data/artworks.json (place-le dans public/data/artworks.json)
 * - Affiche image + métadonnées à gauche
 * - Audio / Vidéo / Viewer 3D à droite
 */

/* ---------- Types ---------- */
type DescriptionMultilang = {
  id: string;
  langue: string; // 'fr' | 'en' | 'wo' ...
  texteComplet: string;
  audioUrl?: string;
  videoUrl?: string;
  historiqueEtContexte?: string;
};

type Oeuvre = {
  id: number;
  qrCodeRef?: string;
  titre: string;
  auteur?: string;
  dateCreation?: string;
  localisationMusee?: string;
  imageUrl?: string;
  modele3dUrl?: string;
  descriptions: DescriptionMultilang[];
};

/* ---------- 3D Model viewer (GLTF) ---------- */
function ModelViewer({ url }: { url?: string | null }) {
  if (!url) {
    return (
      <div className="w-full h-full flex items-center justify-center text-sm text-[#C6B897]">
        Aucun modèle 3D disponible
      </div>
    );
  }

  // useGLTF may throw if model invalid — keep in Suspense with fallback
  try {
    return <GLTFScene url={url} />;
  } catch (e) {
    return (
      <div className="w-full h-full flex items-center justify-center text-sm text-[#C6B897]">
        Impossible de charger le modèle 3D.
      </div>
    );
  }
}

function GLTFScene({ url }: { url: string }) {
  // useGLTF will cache; wrap in Suspense where used
  const { scene } = useGLTF(url as string, true) as any;
  // center & scale
  const root = React.useRef<THREE.Group | null>(null);

  // compute bounding box and scale to fit (simple approach)
  useEffect(() => {
    if (!scene || !root.current) return;
    const box = new THREE.Box3().setFromObject(scene);
    const size = new THREE.Vector3();
    box.getSize(size);
    const max = Math.max(size.x, size.y, size.z);
    let scale = 1;
    if (max > 0) scale = 2.2 / max; // fit into view
    root.current.scale.setScalar(scale);
    // center
    const center = new THREE.Vector3();
    box.getCenter(center);
    root.current.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
  }, [scene]);

  return (
    <>
      <group ref={root}>
        <primitive object={scene} />
      </group>

      <ambientLight intensity={0.9} />
      <directionalLight position={[5, 8, 5]} intensity={0.8} />
      <Environment preset="studio" />
      <OrbitControls enablePan={false} enableZoom={true} />
    </>
  );
}

/* ---------- Main Page Component ---------- */
export default function OeuvreDetailPage(): JSX.Element {
  const { id } = useParams<{ id?: string }>();
  const { i18n, t } = useTranslation();
  const lang = (i18n?.language || "fr").slice(0, 2);

  const [oeuvre, setOeuvre] = useState<Oeuvre | null>(null);
  const [loading, setLoading] = useState(true);
  const [modelError, setModelError] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetch("/data/artworks.json")
      .then((r) => {
        if (!r.ok) throw new Error("Impossible de charger artworks.json");
        return r.json();
      })
      .then((data: Oeuvre[]) => {
        if (!mounted) return;
        const found =
          (id && data.find((o) => String(o.id) === String(id))) || data[0] || null;
        setOeuvre(found);
      })
      .catch((err) => {
        console.error(err);
        setOeuvre(null);
      })
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0603] text-[#D4AF37]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          Chargement de l'œuvre...
        </div>
      </div>
    );
  }

  if (!oeuvre) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0A0603] text-white p-6">
        <h2 className="text-2xl font-semibold text-[#D4AF37] mb-4">
          Œuvre introuvable
        </h2>
        <p className="text-[#C6B897] mb-6">
          Impossible de charger les données de l'œuvre demandée.
        </p>
        <Link
          to="/oeuvres"
          className="px-6 py-3 bg-[#D4AF37] text-black rounded-lg font-semibold"
        >
          Retour aux œuvres
        </Link>
      </div>
    );
  }

  // pick language description (fallback to first)
  const desc =
    oeuvre.descriptions.find((d) => d.langue === lang) || oeuvre.descriptions[0];

  const handlePlayAudio = async () => {
    if (!desc?.audioUrl) return;
    if (!audioRef.current) audioRef.current = new Audio(desc.audioUrl);
    try {
      await audioRef.current.play();
    } catch (e) {
      console.warn("Playback blocked", e);
    }
  };

  const handlePauseAudio = () => {
    if (audioRef.current) audioRef.current.pause();
  };

  return (
    <div className="min-h-screen bg-[#070403] text-white">
      {/* Top controls */}
      <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/oeuvres"
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-black/40 hover:bg-black/30 border border-[#D4AF37]/15 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-[#D4AF37]" />
            <span className="text-[#D4AF37] font-medium">Retour</span>
          </Link>
          <div className="text-sm text-[#C6B897]">
            <span className="font-semibold text-[#D4AF37] mr-2">{oeuvre.titre}</span>
            — {oeuvre.auteur || ""}
          </div>
        </div>

        <div className="text-xs text-[#C6B897]">MCN-Digit — Détails œuvre</div>
      </div>

      {/* Main layout */}
      <div className="max-w-7xl mx-auto px-6 pb-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Image + basic info */}
        <motion.section
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.45 }}
          className="space-y-6"
        >
          <div className="rounded-2xl overflow-hidden border border-[#D4AF37]/20 shadow-xl bg-gradient-to-b from-black/30 to-black/10">
            <img
              src={oeuvre.imageUrl}
              alt={oeuvre.titre}
              className="w-full h-[560px] object-cover"
            />
            <div className="p-5 bg-gradient-to-t from-black/40">
              <h1 className="text-3xl font-bold text-[#D4AF37]">{oeuvre.titre}</h1>
              <p className="text-[#C6B897] mt-2">{desc?.texteComplet}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-black/40 rounded-xl p-4 border border-[#D4AF37]/10">
              <h4 className="text-[#D4AF37] font-semibold">Auteur</h4>
              <p className="text-[#C6B897] mt-1">{oeuvre.auteur}</p>
            </div>
            <div className="bg-black/40 rounded-xl p-4 border border-[#D4AF37]/10">
              <h4 className="text-[#D4AF37] font-semibold">Date</h4>
              <p className="text-[#C6B897] mt-1">{oeuvre.dateCreation}</p>
            </div>
            <div className="bg-black/40 rounded-xl p-4 border border-[#D4AF37]/10">
              <h4 className="text-[#D4AF37] font-semibold">Localisation</h4>
              <p className="text-[#C6B897] mt-1">{oeuvre.localisationMusee}</p>
            </div>
            <div className="bg-black/40 rounded-xl p-4 border border-[#D4AF37]/10">
              <h4 className="text-[#D4AF37] font-semibold">QR</h4>
              <p className="text-[#C6B897] mt-1">{oeuvre.qrCodeRef || "—"}</p>
            </div>
          </div>
        </motion.section>

        {/* Right: audio / video / 3d */}
        <motion.aside
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.45 }}
          className="space-y-6"
        >
          {/* Audio player */}
          <div className="bg-black/40 rounded-2xl p-5 border border-[#D4AF37]/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Volume2 className="w-6 h-6 text-[#D4AF37]" />
                <div>
                  <div className="text-sm font-semibold text-[#D4AF37]">Audio Guide</div>
                  <div className="text-xs text-[#C6B897]">Écoute l'histoire de l'œuvre</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePlayAudio}
                  className="px-3 py-2 bg-[#D4AF37] text-black rounded-lg font-medium"
                >
                  Écouter
                </button>
                <button
                  onClick={handlePauseAudio}
                  className="px-3 py-2 border border-[#D4AF37]/20 rounded-lg text-[#C6B897]"
                >
                  Pause
                </button>
              </div>
            </div>

            {/* native audio element for accessibility (kept hidden) */}
            {desc?.audioUrl && (
              <audio
                src={desc.audioUrl}
                ref={audioRef}
                controls
                className="w-full mt-4"
              />
            )}
            {!desc?.audioUrl && (
              <div className="mt-4 text-xs text-[#C6B897]">Aucun audio disponible</div>
            )}
          </div>

          {/* Video player */}
          <div className="bg-black/40 rounded-2xl p-5 border border-[#D4AF37]/10">
            <div className="flex items-center gap-3 mb-4">
              <Play className="w-5 h-5 text-[#D4AF37]" />
              <h3 className="text-[#D4AF37] font-semibold">Vidéo de présentation</h3>
            </div>

            {desc?.videoUrl ? (
              <div className="aspect-video rounded-lg overflow-hidden border border-[#D4AF37]/10">
                {/* Use native <video> if remote mp4, otherwise iframe for youtube */}
                {desc.videoUrl.includes("youtube") || desc.videoUrl.includes("youtu.be") ? (
                  <iframe
                    src={desc.videoUrl}
                    title={`${oeuvre.titre} - vidéo`}
                    className="w-full h-full"
                    allowFullScreen
                  />
                ) : (
                  <video
                    src={desc.videoUrl}
                    controls
                    className="w-full h-full object-cover bg-black"
                  />
                )}
              </div>
            ) : (
              <div className="h-48 flex items-center justify-center text-[#C6B897]">
                Aucune vidéo disponible
              </div>
            )}
          </div>

          {/* 3D Viewer */}
          <div className="bg-black/40 rounded-2xl p-5 border border-[#D4AF37]/10">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <RotateCcw className="w-5 h-5 text-[#D4AF37]" />
                <h3 className="text-[#D4AF37] font-semibold">Visualisation 3D</h3>
              </div>
              <div className="text-xs text-[#C6B897]">Interragis — zoom | rotation</div>
            </div>

            <div className="w-full h-[360px] rounded-lg overflow-hidden border border-[#D4AF37]/10 bg-black">
              <Suspense
                fallback={
                  <div className="w-full h-full flex items-center justify-center text-[#C6B897]">
                    Chargement 3D…
                  </div>
                }
              >
                {oeuvre.modele3dUrl ? (
                  <Canvas camera={{ position: [2.3, 1.6, 2.3], fov: 45 }}>
                    <ambientLight intensity={0.9} />
                    <directionalLight position={[5, 10, 5]} intensity={1} />
                    <Model3DWrapped url={oeuvre.modele3dUrl} onError={() => setModelError(true)} />
                  </Canvas>
                ) : (
                  // fallback: textured box using artwork image
                  <Canvas camera={{ position: [2.3, 1.6, 2.3], fov: 45 }}>
                    <ambientLight intensity={0.9} />
                    <directionalLight position={[5, 10, 5]} intensity={1} />
                    <TexturedBox imageUrl={oeuvre.imageUrl} />
                  </Canvas>
                )}
              </Suspense>

              {modelError && (
                <div className="absolute right-6 top-6 bg-red-600/80 text-white px-3 py-1 rounded text-xs">
                  Erreur chargement 3D
                </div>
              )}
            </div>
          </div>
        </motion.aside>
      </div>
    </div>
  );
}

/* ---------- helper components ---------- */

// fallback textured box (when no gltf)
function TexturedBox({ imageUrl }: { imageUrl?: string }) {
  const tex = imageUrl || "";
  return (
    <>
      <mesh scale={[1.6, 1.6, 1.6]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial>
          {/* simple colored material; texture via <Html> fallback */}
        </meshStandardMaterial>
      </mesh>
      <OrbitControls enablePan={false} enableZoom={true} />
      <Environment preset="studio" />
      <Html center>
        <div className="w-[180px] bg-black/60 rounded p-2 text-xs text-[#C6B897]">Aperçu 3D</div>
      </Html>
    </>
  );
}

// wrapper to load GLTF and catch runtime errors
function Model3DWrapped({ url, onError }: { url: string; onError?: () => void }) {
  try {
    return <Model3DInner url={url} />;
  } catch (e) {
    console.error("Model3DWrapped error", e);
    onError?.();
    return (
      <Html center>
        <div className="text-red-400">Modèle 3D non chargé</div>
      </Html>
    );
  }
}

function Model3DInner({ url }: { url: string }) {
  // useGLTF returns { scene, materials, nodes } but typed as any
  const gltf = useGLTF(url) as any;

  // basic auto-scale & center
  const groupRef = useRef<THREE.Group | null>(null);
  useEffect(() => {
    if (!gltf?.scene || !groupRef.current) return;
    const box = new THREE.Box3().setFromObject(gltf.scene);
    const size = new THREE.Vector3();
    box.getSize(size);
    const max = Math.max(size.x, size.y, size.z);
    const scale = max > 0 ? 1.8 / max : 1;
    groupRef.current.scale.setScalar(scale);
    const center = new THREE.Vector3();
    box.getCenter(center);
    groupRef.current.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
  }, [gltf]);

  // gentle rotation
  useFrame(() => {
    if (groupRef.current) groupRef.current.rotation.y += 0.003;
  });

  return (
    <>
      <group ref={groupRef}>
        <primitive object={gltf.scene} />
      </group>
      <ambientLight intensity={0.9} />
      <directionalLight position={[4, 6, 3]} intensity={1} />
      <Environment preset="studio" />
      <OrbitControls enablePan={false} enableZoom={true} />
    </>
  );
}


