import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight, LassoSelect, Sparkles } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import mcnPresentationVideo from "../assets/media/mcn-hero-section.mp4";
import backgroundAudio from "../assets/media/african_ambience.mp3"; // 🎧 ton ambiance musée

export function LandingPage() {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const navigate = useNavigate();

  const particles = useMemo(
    () =>
      Array.from({ length: 25 }).map(() => ({
        size: `${Math.random() * 10 + 5}px`,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 5}s`,
        animationDuration: `${Math.random() * 12 + 10}s`,
      })),
    []
  );

  useEffect(() => {
    setIsVisible(true);
    audioRef.current = new Audio(backgroundAudio);
    if (audioRef.current) {
      audioRef.current.loop = true;
      audioRef.current.volume = 0.35;
    }
  }, []);

  const handleStartExperience = () => {
    if (audioRef.current && !isPlaying) {
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    }

    // Lancer l'effet de transition
    setIsTransitioning(true);
    // Après 2.5 secondes (effet terminé), redirection
    setTimeout(() => navigate("/scan"), 2500);
  };

  return (
    <div className="min-h-screen bg-[#0A0603] text-white overflow-hidden font-poppins relative">
      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Fond vidéo */}
        <div className="absolute inset-0">
          <video
            src={mcnPresentationVideo}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-[#2a1b0a]/80 to-[#0A0603]" />
        </div>

        {/* Particules */}
        <div className="absolute inset-0">
          {particles.map((style, i) => (
            <div
              key={i}
              className="absolute bg-[#D4AF37] rounded-full opacity-20 animate-float"
              style={{
                width: style.size,
                height: style.size,
                left: style.left,
                top: style.top,
                animationDelay: style.animationDelay,
                animationDuration: style.animationDuration,
              }}
            />
          ))}
        </div>

        {/* Contenu principal */}
        <div
          className={`relative z-10 text-center px-6 max-w-5xl mx-auto transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6">
            <span className="block text-[#D4AF37] drop-shadow-[0_0_20px_rgba(212,175,55,0.7)]">
              {t("landing.hero.title") ||
                "Plongez au cœur de l’histoire africaine"}
            </span>
            <span className="block text-[#A6753D] mt-3">
              {t("landing.hero.subtitle") ||
                "Une immersion dans la mémoire du continent"}
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-[#C6B897] max-w-3xl mx-auto mb-10 leading-relaxed">
            {t("landing.hero.description") ||
              "Explorez les civilisations, les arts et les légendes qui ont façonné notre héritage. Une expérience numérique qui transcende le temps."}
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-6 mt-8">
            {/* Commencer l’expérience */}
            <button
              onClick={handleStartExperience}
              className="group relative overflow-hidden bg-gradient-to-r from-[#A6753D] to-[#D4AF37] text-white px-10 py-5 rounded-2xl font-semibold text-xl transition-all duration-500 hover:scale-105 shadow-[0_0_20px_rgba(212,175,55,0.5)]"
            >
              <span className="relative z-10 flex items-center gap-3">
                <Sparkles className="w-6 h-6 animate-pulse" />
                {t("landing.cta.start") || "Commencer l’expérience"}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>

            {/* Explorer */}
            <Link
              to="/oeuvres"
              className="relative overflow-hidden border-2 border-[#D4AF37] text-[#D4AF37] px-10 py-5 rounded-2xl font-semibold text-xl hover:text-white hover:bg-[#D4AF37]/10 transition-all duration-500 flex items-center gap-3"
            >
              <LassoSelect className="w-6 h-6" />
              {t("landing.cta.explore") || "Explorer nos œuvres"}
            </Link>
          </div>
        </div>

        {/* Effet de lumière centrale */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[600px] bg-[#D4AF37]/20 blur-[120px] rounded-full animate-pulse" />
        </div>

        {/* Indicateur scroll */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-[#D4AF37] rounded-full flex justify-center">
            <div className="w-1 h-3 bg-[#D4AF37] rounded-full mt-2"></div>
          </div>
        </div>

        {/* 🔮 Transition rituelle */}
        {isTransitioning && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/90 backdrop-blur-md z-50 transition-all duration-1000">
            <div className="relative w-[300px] h-[300px] flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-[6px] border-[#D4AF37] animate-pulse-glow"></div>
              <div className="absolute w-[220px] h-[220px] bg-[#D4AF37]/20 rounded-full blur-2xl animate-expand"></div>
              <div className="absolute w-[150px] h-[150px] bg-[#D4AF37]/30 rounded-full blur-3xl animate-smoke"></div>
              <span className="text-[#D4AF37] font-bold text-2xl tracking-widest animate-fade-in">
                {t("landing.transitionText") || "Ouverture du portail..."}
              </span>
            </div>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-[#1A1006] border-t border-[#D4AF37]/20 py-10 text-center text-[#C6B897]">
        <p className="text-sm">
          © 2025 MCN-Digit —{" "}
          {t("landing.footer.rights") ||
            "Préserver la mémoire, célébrer la culture."}
        </p>
      </footer>

      {/* Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(180deg); }
        }
        .animate-float {
          animation: float 18s infinite linear;
        }

        @keyframes pulse-glow {
          0%, 100% { opacity: 0.8; transform: scale(1); box-shadow: 0 0 60px #d4af37; }
          50% { opacity: 1; transform: scale(1.2); box-shadow: 0 0 120px #d4af37; }
        }
        .animate-pulse-glow {
          animation: pulse-glow 2s infinite ease-in-out;
        }

        @keyframes expand {
          0% { transform: scale(0.8); opacity: 0.4; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        .animate-expand {
          animation: expand 2s ease-out infinite;
        }

        @keyframes smoke {
          0% { transform: scale(1) rotate(0deg); opacity: 0.4; }
          100% { transform: scale(1.6) rotate(360deg); opacity: 0; }
        }
        .animate-smoke {
          animation: smoke 3s linear infinite;
        }

        @keyframes fade-in {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 1.5s ease forwards;
        }
      `}</style>
    </div>
  );
}
