// OeuvreDetailPage.jsx
import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Download,
  Share2,
  Heart,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { SimpleViewer3D } from "@/components/Viewer3D";

// Données des œuvres (à remplacer par votre API)
const OEUVRE_DATA = {
  "origines-africaines": {
    id: "origines-africaines",
    title: "Les Origines Africaines",
    img: "/images/niveau1/galerie-homme-noir.jpg",
    description:
      "Berceau de l'humanité et diversité génétique des populations noires. L'Afrique est le continent où sont apparus les premiers humains il y a environ 300 000 ans. Les découvertes archéologiques et génétiques confirment que toutes les populations humaines modernes descendent d'ancêtres africains.",
    category: "Anthropologie",
    date: "Préhistoire - Antiquité",
    localisation: "Afrique subsaharienne",
    audio: "/audio/origines-africaines.mp3",
    video: "/video/origines-africaines.mp4",
    model3D: "/images/niveau1/3D/galerie-homme-noir.glb",
    details: {
      periode: "De 300 000 ans avant notre ère à aujourd'hui",
      materiaux: "Documentation scientifique, artefacts archéologiques",
      dimensions: "Multiple",
      collection: "Anthropologie et Génétique",
    },
  },
  "mali-empire": {
    id: "mali-empire",
    title: "Empire du Mali",
    img: "/images/niveau2/galerie-empires.jpg",
    description:
      "L'âge d'or de l'Afrique de l'Ouest sous Mansa Moussa et l'apogée du commerce transsaharien. Fondé au XIIIe siècle, l'Empire du Mali fut l'un des plus vastes et riches empires de l'histoire africaine, célèbre pour ses villes universitaires comme Tombouctou et sa richesse légendaire.",
    category: "Histoire",
    date: "1235 - 1670",
    localisation: "Afrique de l'Ouest",
    audio: "/audio/mali-empire.mp3",
    video: "/video/mali-empire.mp4",
    model3D: "/models/mali-empire.glb",
    details: {
      periode: "XIIIe - XVIIe siècle",
      materiaux: "Or, textiles, manuscrits",
      dimensions: "Empire couvrant 1 million de km²",
      collection: "Histoire des Empires Africains",
    },
  },
  "memoire-traite": {
    id: "memoire-traite",
    title: "Mémoire de la Traite",
    img: "/images/niveau3/galerie-traite.jpeg",
    description:
      "Histoire et mémoire des traites négrières et leurs impacts durables sur les sociétés africaines et la diaspora. Cette œuvre retrace le parcours douloureux de millions d'Africains déportés et leur résilience face à l'oppression.",
    category: "Histoire",
    date: "XVe - XIXe siècle",
    localisation: "Afrique, Amériques, Caraïbes",
    audio: "/audio/memoire-traite.mp3",
    video: "/video/memoire-traite.mp4",
    model3D: "/models/memoire-traite.glb",
    details: {
      periode: "1441 - 1888",
      materiaux: "Archives, témoignages, artefacts",
      dimensions: "Installation multimédia",
      collection: "Mémoire et Histoire",
    },
  },
};

export default function OeuvreDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [activeTab, setActiveTab] = useState("audio");
  const [isLiked, setIsLiked] = useState(false);

  const audioRef = useRef(null);
  const videoRef = useRef(null);
  const progressRef = useRef(null);

  const oeuvre = OEUVRE_DATA[id];

  useEffect(() => {
    if (!oeuvre) {
      navigate("/oeuvres");
      return;
    }
  }, [oeuvre, navigate]);

  // Gestion audio
  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleProgressClick = (e) => {
    if (audioRef.current && progressRef.current) {
      const rect = progressRef.current.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      audioRef.current.currentTime = percent * duration;
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  if (!oeuvre) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0603] to-[#1a120b] text-white">
      {/* Header */}
      <header className="border-b border-[#D4AF37]/20 bg-black/40 backdrop-blur-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate("/oeuvres")}
              className="flex items-center gap-3 text-[#D4AF37] hover:text-white transition-colors group"
            >
              <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
              <span className="font-semibold">Retour au Musée</span>
            </button>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`p-2 rounded-full transition-all ${
                  isLiked
                    ? "bg-red-500/20 text-red-400"
                    : "bg-[#D4AF37]/10 text-[#D4AF37] hover:bg-[#D4AF37]/20"
                }`}
              >
                <Heart
                  className="w-5 h-5"
                  fill={isLiked ? "currentColor" : "none"}
                />
              </button>

              <button className="p-2 bg-[#D4AF37]/10 text-[#D4AF37] rounded-lg hover:bg-[#D4AF37]/20 transition-colors">
                <Share2 className="w-5 h-5" />
              </button>

              <button className="p-2 bg-[#D4AF37]/10 text-[#D4AF37] rounded-lg hover:bg-[#D4AF37]/20 transition-colors">
                <Download className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Colonne de gauche - Image et informations de base */}
          <div className="space-y-8">
            {/* Image principale */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative bg-[#1a120b] rounded-2xl overflow-hidden border-2 border-[#D4AF37]/30"
            >
              <img
                src={oeuvre.img}
                alt={oeuvre.title}
                className="w-full h-96 object-cover"
                onError={(e) => {
                  e.target.src =
                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%232d1b0e'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='24' fill='%23D4AF37'%3E🖼️ Œuvre%3C/text%3E%3C/svg%3E";
                }}
              />

              <button className="absolute top-4 right-4 p-2 bg-black/60 rounded-lg text-white hover:bg-black/80 transition-colors">
                <Maximize className="w-5 h-5" />
              </button>
            </motion.div>

            {/* Informations détaillées */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-black/40 backdrop-blur-lg rounded-2xl p-6 border border-[#D4AF37]/20"
            >
              <h3 className="text-[#D4AF37] font-bold text-xl mb-4">
                Informations détaillées
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-[#D4AF37]/10">
                  <span className="text-[#C6B897]">Catégorie</span>
                  <span className="text-white font-medium">
                    {oeuvre.category}
                  </span>
                </div>

                <div className="flex justify-between py-2 border-b border-[#D4AF37]/10">
                  <span className="text-[#C6B897]">Période</span>
                  <span className="text-white font-medium">
                    {oeuvre.details.periode}
                  </span>
                </div>

                <div className="flex justify-between py-2 border-b border-[#D4AF37]/10">
                  <span className="text-[#C6B897]">Localisation</span>
                  <span className="text-white font-medium">
                    {oeuvre.localisation}
                  </span>
                </div>

                <div className="flex justify-between py-2 border-b border-[#D4AF37]/10">
                  <span className="text-[#C6B897]">Matériaux</span>
                  <span className="text-white font-medium">
                    {oeuvre.details.materiaux}
                  </span>
                </div>

                <div className="flex justify-between py-2">
                  <span className="text-[#C6B897]">Collection</span>
                  <span className="text-white font-medium">
                    {oeuvre.details.collection}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Colonne de droite - Contenu interactif */}
          <div className="space-y-8">
            {/* En-tête de l'œuvre */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-3">
                <span className="bg-[#D4AF37]/20 text-[#D4AF37] rounded-full px-3 py-1 text-sm font-medium">
                  {oeuvre.category}
                </span>
                <span className="text-[#C6B897] text-sm">{oeuvre.date}</span>
              </div>

              <h1 className="text-4xl lg:text-5xl font-bold text-[#D4AF37] leading-tight">
                {oeuvre.title}
              </h1>

              <p className="text-[#C6B897] text-lg leading-relaxed">
                {oeuvre.description}
              </p>
            </motion.div>

            {/* Navigation des médias */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-black/40 backdrop-blur-lg rounded-2xl overflow-hidden border border-[#D4AF37]/20"
            >
              {/* Tabs */}
              <div className="flex border-b border-[#D4AF37]/20">
                {[
                  { id: "audio", label: "Audio", icon: "▶︎ •၊၊||၊|။|။" },
                  { id: "video", label: "Documentaire Vidéo", icon: "🎥" },
                  { id: "3d", label: "Version 3D", icon: "🧊" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 py-4 text-center font-medium transition-all ${
                      activeTab === tab.id
                        ? "bg-[#D4AF37]/20 text-[#D4AF37] border-b-2 border-[#D4AF37]"
                        : "text-[#C6B897] hover:text-white hover:bg-[#D4AF37]/10"
                    }`}
                  >
                    <span className="flex items-center justify-center gap-2">
                      <span>{tab.icon}</span>
                      <span className="hidden sm:inline">{tab.label}</span>
                    </span>
                  </button>
                ))}
              </div>

              {/* Contenu des tabs */}
              <div className="p-6">
                {/* Tab Audio */}
                {activeTab === "audio" && (
                  <div className="space-y-6">
                    <div className="text-center">
                      <h3 className="text-[#D4AF37] font-bold text-lg mb-2">
                        Contexte Historique Audio
                      </h3>
                      <p className="text-[#C6B897] text-sm">
                        Écoutez l'histoire complète de cette œuvre
                      </p>
                    </div>

                    {/* Lecteur audio */}
                    <div className="bg-[#1a120b] rounded-xl p-6 border border-[#D4AF37]/30">
                      <audio
                        ref={audioRef}
                        onTimeUpdate={handleTimeUpdate}
                        onLoadedMetadata={handleTimeUpdate}
                        onEnded={() => setIsPlaying(false)}
                        className="hidden"
                      >
                        <source src={oeuvre.audio} type="audio/mpeg" />
                        Votre navigateur ne supporte pas l'élément audio.
                      </audio>

                      {/* Contrôles audio */}
                      <div className="space-y-4">
                        {/* Barre de progression */}
                        <div
                          ref={progressRef}
                          onClick={handleProgressClick}
                          className="w-full bg-[#D4AF37]/20 rounded-full h-2 cursor-pointer"
                        >
                          <div
                            className="bg-[#D4AF37] h-2 rounded-full transition-all"
                            style={{
                              width: `${(currentTime / duration) * 100}%`,
                            }}
                          />
                        </div>

                        {/* Contrôles */}
                        <div className="flex items-center justify-between">
                          <span className="text-[#C6B897] text-sm">
                            {formatTime(currentTime)}
                          </span>

                          <div className="flex items-center gap-4">
                            <button
                              onClick={toggleMute}
                              className="text-[#D4AF37] hover:text-white transition-colors"
                            >
                              {isMuted ? (
                                <VolumeX className="w-5 h-5" />
                              ) : (
                                <Volume2 className="w-5 h-5" />
                              )}
                            </button>

                            <button
                              onClick={togglePlayPause}
                              className="bg-[#D4AF37] text-black rounded-full p-3 hover:bg-[#E6C158] transition-colors"
                            >
                              {isPlaying ? (
                                <Pause className="w-6 h-6" />
                              ) : (
                                <Play className="w-6 h-6" />
                              )}
                            </button>
                          </div>

                          <span className="text-[#C6B897] text-sm">
                            {formatTime(duration)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Transcription (optionnelle) */}
                    <div className="bg-[#1a120b] rounded-xl p-6 border border-[#D4AF37]/30">
                      <h4 className="text-[#D4AF37] font-bold mb-3">
                        Transcription
                      </h4>
                      <p className="text-[#C6B897] text-sm leading-relaxed">
                        {oeuvre.description} Cette œuvre représente un chapitre
                        important de l'histoire des civilisations noires...
                      </p>
                    </div>
                  </div>
                )}

                {/* Tab Vidéo */}
                {activeTab === "video" && (
                  <div className="space-y-4">
                    <div className="text-center">
                      <h3 className="text-[#D4AF37] font-bold text-lg mb-2">
                        Documentaire Vidéo
                      </h3>
                      <p className="text-[#C6B897] text-sm">
                        Découvrez l'histoire visuelle de cette œuvre
                      </p>
                    </div>

                    <div className="bg-[#1a120b] rounded-xl overflow-hidden border border-[#D4AF37]/30">
                      <video
                        ref={videoRef}
                        className="w-full h-64 object-cover"
                        controls
                        poster={oeuvre.img}
                      >
                        <source src={oeuvre.video} type="video/mp4" />
                        Votre navigateur ne supporte pas l'élément vidéo.
                      </video>
                    </div>

                    
                  </div>
                )}

                {/* Tab 3D */}
                {activeTab === '3d' && (
                    <div className="space-y-6">
                      <div className="text-center">
                        <h3 className="text-[#D4AF37] font-bold text-lg mb-2">
                          Exploration 3D Interactive
                        </h3>
                        <p className="text-[#C6B897] text-sm">
                          Tournez, zoomez et explorez cette œuvre sous tous les angles
                        </p>
                      </div>

                      {/* Utilisez Viewer3D ou SimpleViewer3D selon ce qui fonctionne */}
                      <SimpleViewer3D 
                        modelUrl={oeuvre.model3D}
                        className="h-96 w-full"
                      />

                      {/* Message d'information */}
                      <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <span className="text-[#D4AF37] text-lg">💡</span>
                          <div>
                            <h4 className="text-[#D4AF37] font-semibold mb-1">Information 3D</h4>
                            <p className="text-[#C6B897] text-sm">
                              Les modèles 3D sont chargés depuis des fichiers GLB optimisés. 
                              Si un modèle n'est pas disponible, un placeholder s'affichera.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
