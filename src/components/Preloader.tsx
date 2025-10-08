import React from 'react';
import { motion } from 'framer-motion';
import logo from '../assets/img/Logo MCN-Digit.JPG';

export const Preloader = () => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0A0603]">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative flex items-center justify-center w-80 h-80"
      >
        {/* Outer spin */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 10, ease: 'linear', repeat: Infinity }}
          className="absolute w-full h-full border-2 border-dashed border-[#D4AF37] rounded-full"
        />
        {/* Inner spin (opposite direction) */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 7, ease: 'linear', repeat: Infinity }}
          className="absolute w-5/6 h-5/6 border-2 border-[#D4AF37]/50 rounded-full"
        />
        {/* Logo */}
        <motion.img
          src={logo}
          alt="Musée des Civilisations Noires Logo"
          className="w-40 h-40 rounded-full shadow-2xl shadow-[#D4AF37]/30"
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2.5,
            ease: 'easeInOut',
            repeat: Infinity,
          }}
        />
      </motion.div>
    </div>
  );
};
