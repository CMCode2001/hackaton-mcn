import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { QrCode, Home, Image as ImageIcon, Globe, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LogoMCN from "../assets/img/Logo MCN-Digit.png";

export function Header() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoverLogo, setHoverLogo] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setShowLangMenu(false);
  };

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: "/", label: t("nav.home"), icon: <Home className="w-4 h-4" /> },
    {
      path: "/oeuvres",
      label: t("nav.artworks"),
      icon: <ImageIcon className="w-4 h-4" />,
    },
    {
      path: "/scan",
      label: t("nav.scan"),
      icon: <QrCode className="w-4 h-4" />,
    },
  ];

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`sticky top-0 z-[100] transition-all duration-700 ${
        isScrolled
          ? "backdrop-blur-xl bg-[#1a1006]/80 py-2 shadow-lg border-b border-white/5"
          : "bg-gradient-to-br from-[#5e3a1c] via-[#3b2310] to-[#1a1006] py-4 shadow-md"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          layout
          className="relative bg-white/5 border border-white/10 rounded-full px-6 flex items-center justify-between backdrop-blur-md shadow-lg"
        >
          {/* --- LOGO --- */}
          <Link
            to="/"
            className="flex items-center gap-2 py-2 relative"
            onMouseEnter={() => setHoverLogo(true)}
            onMouseLeave={() => setHoverLogo(false)}
          >
            {/* Halo lumineux (effet rituelle) */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              animate={{
                opacity: hoverLogo ? [0.2, 0.5, 0.2] : 0,
                scale: hoverLogo ? [1, 1.2, 1] : 1,
              }}
              transition={{
                duration: 2,
                repeat: hoverLogo ? Infinity : 0,
                ease: "easeInOut",
              }}
            >
              <div className="w-52 h-52 rounded-full bg-amber-400/20 blur-3xl" />
            </motion.div>

            <motion.img
              src={LogoMCN}
              alt="Logo MCN"
              className="w-40 sm:w-52 md:w-60 relative z-10"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            />
          </Link>

          {/* --- MOBILE MENU BUTTON --- */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* --- DESKTOP NAVIGATION --- */}
          <nav className="hidden md:flex items-center gap-6 relative">
            {navItems.map((item, i) => (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="relative"
              >
                <Link
                  to={item.path}
                  className={`relative px-2 py-2 flex flex-col items-center text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? "text-[#ffb347]"
                      : "text-[#e3e3e3] hover:text-[#ffb347]"
                  }`}
                >
                  {item.icon}
                  <span className="hidden sm:inline mt-1">{item.label}</span>
                </Link>

                {/* Barre active animée */}
                {isActive(item.path) && (
                  <motion.div
                    layoutId="underline"
                    className="absolute left-1/2 -translate-x-1/2 -bottom-1 h-[2px] w-6 bg-white rounded-full"
                    transition={{ type: "spring", stiffness: 400, damping: 28 }}
                  />
                )}
              </motion.div>
            ))}

            {/* --- LANG SELECTOR --- */}
            <div className="relative">
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="relative px-3 py-2 rounded-full text-[#e3e3e3] hover:text-[#ffb347] flex items-center gap-2 transition"
              >
                <Globe className="w-4 h-4" />
                <span className="hidden sm:inline uppercase text-xs font-semibold tracking-wide">
                  {i18n.language}
                </span>
              </button>

              <AnimatePresence>
                {showLangMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                    className="absolute right-0 mt-2 w-36 bg-[#1a1a1a]/95 backdrop-blur-md border border-white/10 rounded-xl shadow-xl py-2 z-50"
                  >
                    {["fr", "en", "wo"].map((lng) => (
                      <button
                        key={lng}
                        onClick={() => changeLanguage(lng)}
                        className={`w-full px-4 py-2 text-left text-sm rounded-lg transition-all ${
                          i18n.language === lng
                            ? "bg-white/10 text-white font-semibold"
                            : "text-gray-300 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        {t(`language.${lng}`)}{" "}
                        <span className="ml-1 text-xs opacity-70">({lng})</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>
        </motion.div>

        {/* --- MOBILE MENU --- */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="md:hidden mt-2 bg-white/5 border border-white/10 rounded-lg p-4"
            >
              <nav className="flex flex-col gap-4">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive(item.path)
                        ? "bg-white/10 text-[#ffb347]"
                        : "text-[#e3e3e3] hover:bg-white/10 hover:text-[#ffb347]"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                ))}
                {/* --- LANG SELECTOR --- */}
                <div className="relative pt-2 border-t border-white/10">
                  <button
                    onClick={() => setShowLangMenu(!showLangMenu)}
                    className="w-full flex justify-between items-center px-3 py-2 rounded-md text-[#e3e3e3] hover:bg-white/10 hover:text-[#ffb347] transition"
                  >
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      <span className="uppercase text-xs font-semibold tracking-wide">
                        {i18n.language}
                      </span>
                    </div>
                    <span className="text-xs">▼</span>
                  </button>

                  <AnimatePresence>
                    {showLangMenu && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-1 bg-[#1a1a1a]/95 backdrop-blur-md border border-white/10 rounded-xl shadow-xl py-2 z-50"
                      >
                        {["fr", "en", "wo"].map((lng) => (
                          <button
                            key={lng}
                            onClick={() => changeLanguage(lng)}
                            className={`w-full px-4 py-2 text-left text-sm rounded-lg transition-all ${
                              i18n.language === lng
                                ? "bg-white/10 text-white font-semibold"
                                : "text-gray-300 hover:bg-white/10 hover:text-white"
                            }`}
                          >
                            {t(`language.${lng}`)}{" "}
                            <span className="ml-1 text-xs opacity-70">({lng})</span>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
