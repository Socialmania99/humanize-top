import React from 'react';
import { motion } from 'motion/react';

export const Mascot: React.FC<{ size?: number; className?: string }> = ({ size = 48, className = "" }) => {
  return (
    <motion.div 
      initial={{ y: 0 }}
      animate={{ y: [0, -5, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      className={`relative inline-block ${className}`}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Robot Head */}
        <rect x="20" y="30" width="60" height="50" rx="10" fill="#141414" />
        {/* Human Eye (Left) */}
        <circle cx="40" cy="50" r="8" fill="#00FF00" />
        <circle cx="40" cy="50" r="3" fill="#000" />
        {/* Robot Eye (Right) */}
        <rect x="55" y="45" width="15" height="10" rx="2" fill="#00FF00" />
        <rect x="58" y="48" width="9" height="4" rx="1" fill="#000" />
        {/* Antenna */}
        <line x1="50" y1="30" x2="50" y2="15" stroke="#141414" strokeWidth="4" />
        <circle cx="50" cy="15" r="5" fill="#00FF00" />
        {/* Smile */}
        <path d="M40 65 Q50 75 60 65" stroke="#00FF00" strokeWidth="3" fill="none" strokeLinecap="round" />
      </svg>
    </motion.div>
  );
};
