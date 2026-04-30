import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import { CheckCircle2, Info, ListTree, FileText, ArrowUpRight } from 'lucide-react';

const ResultCard = ({ title, content, type, delay = 0 }) => {
  const icons = {
    explanation: <Info className="text-highlight-electric" size={20} />,
    mitigations: <CheckCircle2 className="text-emerald-400" size={20} />,
    summary: <ListTree className="text-secondary-neon" size={20} />,
    compliance: <FileText className="text-primary-light" size={20} />
  };

  const accents = {
    explanation: 'border-l-highlight-electric group-hover:shadow-[0_10px_40px_rgba(0,223,216,0.15)]',
    mitigations: 'border-l-emerald-400 group-hover:shadow-[0_10px_40px_rgba(52,211,153,0.15)]',
    summary: 'border-l-secondary-neon group-hover:shadow-[0_10px_40px_rgba(138,43,226,0.15)]',
    compliance: 'border-l-primary group-hover:shadow-[0_10px_40px_rgba(0,112,243,0.15)]'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ 
        delay,
        duration: 0.8,
        type: "spring",
        stiffness: 90,
        damping: 15
      }}
      className={`glass-panel p-8 h-full border-l-[4px] transition-all duration-500 group ${accents[type]}`}
    >
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-slate-100 dark:bg-black/40 border border-slate-200 dark:border-white/5 transition-colors group-hover:bg-white/50 dark:group-hover:bg-white/10 shadow-inner">
            {icons[type]}
          </div>
          <h3 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">{title}</h3>
        </div>
        <ArrowUpRight size={16} className="text-slate-400 dark:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm font-medium">
        {type === 'explanation' || type === 'compliance' ? (
          <div className="min-h-[120px] bg-white/60 dark:bg-black/20 p-5 rounded-2xl border border-slate-200 dark:border-white/5 shadow-inner">
            <TypeAnimation
              sequence={[content]}
              speed={85}
              cursor={false}
              className="text-slate-700 dark:text-slate-300"
            />
          </div>
        ) : type === 'mitigations' ? (
          <ul className="space-y-4">
            {Array.isArray(content) ? content.map((item, i) => (
              <motion.li 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: delay + 0.4 + (0.1 * i) }}
                className="flex items-start gap-4 bg-white/40 dark:bg-black/30 p-4 rounded-2xl border border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10 transition-colors"
              >
                <div className="mt-1.5 w-2 h-2 rounded-full bg-emerald-400 shrink-0 shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
                <span className="leading-snug">{item}</span>
              </motion.li>
            )) : <li>{content}</li>}
          </ul>
        ) : type === 'summary' ? (
          <div className="grid grid-cols-1 gap-4">
            {Array.isArray(content) ? content.map((item, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: delay + 0.4 + (0.1 * i) }}
                className="flex justify-between items-center bg-white/40 dark:bg-black/40 p-4 rounded-2xl border border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/20 transition-all"
              >
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 dark:text-slate-500">{item.label}</span>
                <span className="text-slate-900 dark:text-white font-black tracking-tight">{item.value}</span>
              </motion.div>
            )) : <p>{content}</p>}
          </div>
        ) : null}
      </div>
    </motion.div>
  );
};

export default ResultCard;
