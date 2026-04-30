import { motion } from 'framer-motion';
import { Cpu, Zap, Box, Sparkles } from 'lucide-react';

const ModelSelector = ({ activeModel, onSelect }) => {
  const models = [
    { id: 'groq', name: 'Groq (LLaMA 3)', icon: <Zap size={14} />, desc: 'Ultra-fast inference', color: 'text-amber-400' },
    { id: 'openai', name: 'OpenAI (GPT-4)', icon: <Sparkles size={14} />, desc: 'Premium reasoning', color: 'text-emerald-400' },
    { id: 'huggingface', name: 'Hugging Face', icon: <Box size={14} />, desc: 'Open-weight backup', color: 'text-blue-400' },
  ];

  return (
    <div className="flex flex-wrap gap-3 mb-8">
      {models.map((model) => (
        <motion.button
          key={model.id}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect(model.id)}
          className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-all duration-300 ${
            activeModel === model.id
              ? 'bg-white/20 dark:bg-white/10 border-highlight shadow-neon-indigo text-slate-900 dark:text-white'
              : 'bg-slate-200/50 dark:bg-black/20 border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-white/30'
          }`}
        >
          <div className={`${activeModel === model.id ? model.color : 'text-slate-500'} transition-colors`}>
            {model.icon}
          </div>
          <div className="text-left">
            <p className="text-xs font-bold leading-none">{model.name}</p>
            <p className="text-[10px] opacity-60 mt-0.5">{model.desc}</p>
          </div>
        </motion.button>
      ))}
    </div>
  );
};

export default ModelSelector;
