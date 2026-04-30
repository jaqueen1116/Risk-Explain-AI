import { useEffect, useState } from 'react';
import { motion, animate } from 'framer-motion';

const RiskMeter = ({ score }) => {
  const [animatedScore, setAnimatedScore] = useState(score);

  useEffect(() => {
    const controls = animate(animatedScore, score, {
      duration: 1,
      ease: "easeOut",
      onUpdate(value) {
        setAnimatedScore(Math.round(value));
      }
    });
    
    return () => controls.stop();
  }, [score]);

  const getColors = (s) => {
    if (s <= 25) return { main: '#10b981', glow: 'rgba(16, 185, 129, 0.4)' }; // Emerald
    if (s <= 50) return { main: '#f59e0b', glow: 'rgba(245, 158, 11, 0.4)' }; // Amber
    if (s <= 75) return { main: '#ef4444', glow: 'rgba(239, 68, 68, 0.4)' }; // Red
    return { main: '#a855f7', glow: 'rgba(168, 85, 247, 0.4)' }; // Purple
  };

  const colors = getColors(score);
  
  const radius = 90;
  const strokeWidth = 14;
  const circumference = radius * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center justify-center w-full max-w-[320px] mx-auto py-8">
      {/* Glow behind the meter */}
      <motion.div 
        className="absolute top-[60%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 rounded-full blur-[50px] mix-blend-screen pointer-events-none"
        animate={{ backgroundColor: colors.main, opacity: 0.2 }}
        transition={{ duration: 1 }}
      />
      
      <div className="relative w-full aspect-[2/1] flex items-end justify-center">
        <svg 
          viewBox="0 0 200 100" 
          className="w-full h-full drop-shadow-2xl"
          style={{ overflow: 'visible' }}
        >
          <defs>
            <linearGradient id="meterGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="33%" stopColor="#f59e0b" />
              <stop offset="66%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
            
            <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Track */}
          <path
            d="M 10 100 A 90 90 0 0 1 190 100"
            fill="none"
            stroke="currentColor"
            className="text-slate-200 dark:text-white/5 transition-colors duration-500"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Colored Active Track */}
          <motion.path
            d="M 10 100 A 90 90 0 0 1 190 100"
            fill="none"
            stroke="url(#meterGradient)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            filter="url(#neonGlow)"
          />
        </svg>

        {/* Score Readout */}
        <div className="absolute bottom-[-2px] left-1/2 -translate-x-1/2 flex flex-col items-center">
          <motion.div 
            className="text-[5rem] leading-none font-black tracking-tighter"
            animate={{ color: colors.main }}
            transition={{ duration: 1 }}
            style={{ textShadow: `0 0 30px ${colors.glow}` }}
          >
            {animatedScore}
          </motion.div>
          <div className="text-sm font-bold uppercase tracking-[0.25em] text-slate-500 mt-2">
            Risk Score
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskMeter;
