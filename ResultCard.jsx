import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ShieldCheck, TrendingUp, DollarSign, LineChart, FileText, Globe, Landmark, Euro, JapaneseYen, IndianRupee, BarChart4 } from 'lucide-react';

const FloatingIcon = ({ el, parallaxX, parallaxY }) => {
  const x = useTransform(parallaxX, (v) => v * el.factor);
  const y = useTransform(parallaxY, (v) => v * el.factor);

  return (
    <motion.div
      className={`absolute select-none transition-opacity duration-1000 ${el.animation} ${el.color} opacity-60 dark:opacity-40`}
      style={{ top: el.top, left: el.left, x, y }}
    >
      <el.Icon size={el.size} strokeWidth={1.5} />
    </motion.div>
  );
};

const FloatingElements = () => {
  const [mounted, setMounted] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  const springConfig = { damping: 40, stiffness: 80 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const parallaxX = useTransform(smoothX, [0, typeof window !== 'undefined' ? window.innerWidth : 1000], [-80, 80]);
  const parallaxY = useTransform(smoothY, [0, typeof window !== 'undefined' ? window.innerHeight : 1000], [-80, 80]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  if (!mounted) return null;

  const elements = [
    { Icon: LineChart, size: 72, top: '15%', left: '8%', animation: 'animate-float', factor: 0.8, color: 'text-highlight/60 dark:text-highlight/40' },
    { Icon: BarChart4, size: 64, top: '65%', left: '10%', animation: 'animate-float-alt', factor: 1.2, color: 'text-primary/60 dark:text-primary/40' },
    { Icon: TrendingUp, size: 80, top: '22%', left: '80%', animation: 'animate-float-slow', factor: 0.6, color: 'text-secondary/60 dark:text-secondary/40' },
    { Icon: Landmark, size: 90, top: '75%', left: '75%', animation: 'animate-float', factor: 1.5, color: 'text-highlight/50 dark:text-highlight/30' },
    { Icon: ShieldCheck, size: 56, top: '48%', left: '88%', animation: 'animate-float-alt', factor: 0.9, color: 'text-emerald-500/60 dark:text-emerald-500/40' },
    { Icon: Globe, size: 68, top: '10%', left: '42%', animation: 'animate-float-slow', factor: 1.1, color: 'text-primary/50 dark:text-primary/30' },
    { Icon: FileText, size: 48, top: '85%', left: '32%', animation: 'animate-float', factor: 0.7, color: 'text-slate-400/60 dark:text-slate-500/40' },
    
    /* Currencies */
    { Icon: DollarSign, size: 42, top: '35%', left: '22%', animation: 'animate-float-alt', factor: 1.1, color: 'text-emerald-500/60 dark:text-emerald-500/40' },
    { Icon: Euro, size: 36, top: '55%', left: '6%', animation: 'animate-float', factor: 1.4, color: 'text-primary/60 dark:text-primary/40' },
    { Icon: JapaneseYen, size: 42, top: '25%', left: '62%', animation: 'animate-float-alt', factor: 0.8, color: 'text-secondary/60 dark:text-secondary/40' },
    { Icon: IndianRupee, size: 38, top: '80%', left: '52%', animation: 'animate-float-slow', factor: 1.3, color: 'text-highlight/60 dark:text-highlight/40' },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 bg-transparent transition-colors duration-500">
      <div className="bg-grid-pattern" />
      <div className="mesh-gradient" />
      
      {elements.map((el, i) => (
        <FloatingIcon key={i} el={el} parallaxX={parallaxX} parallaxY={parallaxY} />
      ))}
      
      {/* Premium Background Dynamic Glows */}
      <div className="absolute top-[-15%] left-[-10%] w-[800px] h-[800px] bg-primary/15 rounded-full blur-[160px] animate-pulse-slow mix-blend-screen" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[900px] h-[900px] bg-secondary/15 rounded-full blur-[180px] animate-pulse-slow mix-blend-screen" style={{ animationDelay: '4s' }} />
      <div className="absolute top-[30%] left-[40%] w-[600px] h-[600px] bg-highlight/10 rounded-full blur-[140px] animate-pulse-slow mix-blend-screen" style={{ animationDelay: '2s' }} />
    </div>
  );
};

export default FloatingElements;
