import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Loader2 } from 'lucide-react';

const AILoader = () => {
  const messages = [
    "Analyzing financial data...",
    "Evaluating risk exposure...",
    "Generating mitigation strategies...",
    "Finalizing report..."
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < messages.length - 1) {
      const timer = setTimeout(() => {
        setIndex(prev => prev + 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [index, messages.length]);

  return (
    <div className="flex flex-col items-center justify-center p-12 glass rounded-3xl min-h-[300px] border border-white/10 shadow-2xl relative overflow-hidden">
      {/* Background Pulse */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 animate-pulse" />
      
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        className="mb-8 relative"
      >
        <Loader2 className="text-highlight animate-pulse" size={48} />
        <div className="absolute inset-0 blur-lg bg-highlight/30 rounded-full" />
      </motion.div>

      <div className="h-8 relative overflow-hidden text-center w-full">
        <AnimatePresence mode="wait">
          <motion.p
            key={index}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="text-slate-900 dark:text-white text-xl font-medium tracking-tight"
          >
            {messages[index]}
          </motion.p>
        </AnimatePresence>
      </div>

      <div className="mt-8 flex gap-2">
        {messages.map((_, i) => (
          <div 
            key={i} 
            className={`h-1 rounded-full transition-all duration-500 ${
              i <= index ? 'w-8 bg-highlight shadow-neon-indigo' : 'w-2 bg-slate-300 dark:bg-white/10'
            }`} 
          />
        ))}
      </div>
      
      <div className="mt-4 flex items-center gap-2 text-[10px] text-slate-500 uppercase tracking-widest font-bold">
        <Sparkles size={10} className="text-highlight" />
        Deep Analysis Active
      </div>
    </div>
  );
};

export default AILoader;
