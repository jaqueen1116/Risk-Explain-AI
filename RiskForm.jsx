import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Trash2, History, AlertTriangle, TrendingUp, TrendingDown, Minus, Clock, Shield } from 'lucide-react';

const HistoryPage = ({ history, onSelect, onClear }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest'); // 'newest', 'oldest', 'highest_risk'

  const categories = ['All', 'Credit', 'Market', 'Operational', 'Liquidity', 'Compliance', 'Reputational', 'Strategic', 'Systemic', 'Legal', 'Cybersecurity', 'Other'];

  const filteredHistory = useMemo(() => {
    return history
      .filter(item => {
        const matchesSearch = 
          item.category.toLowerCase().includes(searchTerm.toLowerCase()) || 
          item.formData.scenario_description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === 'All' || item.category === filterCategory;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') return new Date(b.timestamp) - new Date(a.timestamp);
        if (sortBy === 'oldest') return new Date(a.timestamp) - new Date(b.timestamp);
        if (sortBy === 'highest_risk') return b.risk_score - a.risk_score;
        return 0;
      });
  }, [history, searchTerm, filterCategory, sortBy]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-6xl mx-auto"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
        <div>
          <h2 className="text-4xl md:text-5xl font-display font-black tracking-tight mb-2 flex items-center gap-4">
            <History className="text-primary" size={40} />
            Analysis History
          </h2>
          <p className="text-slate-400 font-medium">Review and reload your previous risk assessments.</p>
        </div>
        
        {history.length > 0 && (
          <button
            onClick={onClear}
            className="flex items-center gap-2 px-5 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-xl transition-all font-bold text-sm uppercase tracking-wider"
          >
            <Trash2 size={16} />
            Clear History
          </button>
        )}
      </div>

      {history.length > 0 && (
        <div className="glass-panel p-4 mb-8 bg-white/60 dark:bg-black/40 border border-slate-200 dark:border-white/10 flex flex-col md:flex-row gap-4 items-center">
          {/* Search */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input
              type="text"
              placeholder="Search scenarios or categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl py-3 pl-11 pr-4 text-slate-900 dark:text-white placeholder:text-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
          </div>

          {/* Category Filter */}
          <div className="relative w-full md:w-48">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl py-3 pl-11 pr-4 text-slate-900 dark:text-white appearance-none focus:outline-none focus:border-primary cursor-pointer"
            >
              {categories.map(c => <option key={c} value={c} className="bg-white dark:bg-[#02040a]">{c}</option>)}
            </select>
          </div>

          {/* Sort */}
          <div className="relative w-full md:w-48">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl py-3 px-4 text-slate-900 dark:text-white appearance-none focus:outline-none focus:border-primary cursor-pointer"
            >
              <option value="newest" className="bg-white dark:bg-[#02040a]">Sort: Newest First</option>
              <option value="oldest" className="bg-white dark:bg-[#02040a]">Sort: Oldest First</option>
              <option value="highest_risk" className="bg-white dark:bg-[#02040a]">Sort: Highest Risk</option>
            </select>
          </div>
        </div>
      )}

      {history.length === 0 ? (
        <div className="glass-panel py-32 flex flex-col items-center justify-center text-center opacity-70 border-slate-200 dark:border-white/5 bg-white/50 dark:bg-transparent">
          <div className="w-24 h-24 bg-slate-200 dark:bg-white/5 rounded-full flex items-center justify-center mb-6">
            <History size={40} className="text-slate-500" />
          </div>
          <h3 className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-2">No History Yet</h3>
          <p className="text-slate-600 dark:text-slate-400 max-w-sm">Complete your first risk assessment on the Dashboard and it will appear here.</p>
        </div>
      ) : filteredHistory.length === 0 ? (
        <div className="py-20 text-center text-slate-500">
          <Search size={40} className="mx-auto mb-4 opacity-50" />
          <p className="text-lg">No results found matching your filters.</p>
        </div>
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {filteredHistory.map((item) => {
              const date = new Date(item.timestamp).toLocaleString(undefined, {
                month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
              });
              
              const trend = item.analysisData?.risk_assessment?.trend || 'Stable';
              const confidence = item.analysisData?.confidence_score || 0;

              return (
                <motion.div
                  key={item.id}
                  variants={itemVariants}
                  layout
                  onClick={() => onSelect(item)}
                  className="group relative glass-panel bg-white/70 dark:bg-black/40 hover:bg-slate-50 dark:hover:bg-white/5 border border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/20 p-6 rounded-3xl cursor-pointer transition-all duration-300 flex flex-col h-full overflow-hidden"
                  whileHover={{ y: -5 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  
                  {/* Top Bar */}
                  <div className="flex items-start justify-between mb-6 relative z-10">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest bg-slate-200 dark:bg-white/10 px-3 py-1 rounded-lg w-max shadow-sm">
                        {item.category}
                      </span>
                      <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-[11px] font-medium mt-1">
                        <Clock size={12} />
                        <span>{date}</span>
                      </div>
                    </div>
                    
                    <div className="w-14 h-14 rounded-full flex items-center justify-center relative shadow-inner bg-slate-100 dark:bg-black/50 border border-slate-300 dark:border-white/5">
                      <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          className="text-slate-300 dark:text-slate-800"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none" stroke="currentColor" strokeWidth="3"
                        />
                        <path
                          className={`${
                            item.severity === 'Low' ? 'text-emerald-500' :
                            item.severity === 'Moderate' ? 'text-amber-500' :
                            item.severity === 'High' ? 'text-rose-500' :
                            'text-purple-500'
                          }`}
                          strokeDasharray={`${item.risk_score}, 100`}
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"
                        />
                      </svg>
                      <span className="text-lg font-black text-slate-900 dark:text-white relative z-10">{item.risk_score}</span>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 mb-6 relative z-10">
                    <div className={`text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 px-2.5 py-1 rounded border ${
                      item.severity === 'Low' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                      item.severity === 'Moderate' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                      item.severity === 'High' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                      'bg-purple-500/10 text-purple-400 border-purple-500/20'
                    }`}>
                      <AlertTriangle size={10} />
                      {item.severity} Severity
                    </div>
                    
                    <div className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 px-2.5 py-1 rounded border bg-blue-500/10 text-blue-400 border-blue-500/20">
                      {trend.toLowerCase().includes('increasing') || trend.toLowerCase().includes('escalating') ? <TrendingUp size={10} /> : 
                       trend.toLowerCase().includes('decreasing') || trend.toLowerCase().includes('declining') ? <TrendingDown size={10} /> : 
                       <Minus size={10} />}
                      {trend}
                    </div>
                  </div>

                  {/* Scenario Snippet */}
                  <div className="mt-auto relative z-10">
                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                      "{item.formData.scenario_description}"
                    </p>
                    
                    <div className="mt-4 pt-4 border-t border-slate-200 dark:border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-widest text-slate-500">
                        <Shield size={12} className="text-primary/70" />
                        Confidence: <span className="text-slate-900 dark:text-white">{confidence}%</span>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-primary opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                        View Report →
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}
    </motion.div>
  );
};

export default HistoryPage;
