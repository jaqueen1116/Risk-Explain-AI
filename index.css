import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, AlertTriangle, Sparkles } from 'lucide-react';
import RiskMeter from './RiskMeter';

const RiskForm = ({ onSubmit, isLoading, initialData }) => {
  const [formData, setFormData] = useState({
    risk_score: 50,
    category: 'Operational',
    severity: 'Medium',
    scenario_description: ''
  });
  const [contradictionWarning, setContradictionWarning] = useState(null);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const categories = ['Credit', 'Market', 'Operational', 'Reputational', 'Strategic', 'Legal', 'Cybersecurity', 'Other'];

  const getSeverity = (score) => {
    if (score <= 25) return 'Low';
    if (score <= 50) return 'Moderate';
    if (score <= 75) return 'High';
    return 'Critical';
  };

  const checkContradiction = (score, desc) => {
    const descLower = desc.toLowerCase();
    const severeKeywords = ['bankruptcy', 'fraud', 'insolvency', 'loan default', 'legal notice', 'account freeze', 'cyberattack', 'data breach', 'compliance violation', 'money laundering', 'shutdown', 'lawsuit', 'ransomware', 'liquidation'];
    const minorKeywords = ['1 day delay', 'small invoice issue', 'temporary slowdown', 'typo', 'minor reporting delay', 'isolated incident'];
    
    const hasSevere = severeKeywords.some(kw => descLower.includes(kw));
    const hasMinor = minorKeywords.some(kw => descLower.includes(kw));
    
    if (hasSevere && score < 60) {
      setContradictionWarning("⚠ Scenario indicates higher real-world severity than selected score.");
    } else if (hasMinor && score > 79) {
      setContradictionWarning("⚠ Selected score appears higher than scenario severity.");
    } else {
      setContradictionWarning(null);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newScore = formData.risk_score;
    let newDesc = formData.scenario_description;
    
    if (name === 'risk_score') {
      newScore = parseFloat(value);
      setFormData(prev => ({ 
        ...prev, 
        risk_score: newScore,
        severity: getSeverity(newScore)
      }));
    } else {
      if (name === 'scenario_description') newDesc = value;
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    checkContradiction(newScore, newDesc);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
      className="glass-panel w-full mb-16 p-[1px]"
    >
      <div className="bg-white/80 dark:bg-[#02040a]/80 backdrop-blur-xl rounded-[23px] p-8 md:p-10 transition-colors duration-500">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Inputs */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 uppercase tracking-wider">Risk Category</label>
                <div className="relative">
                  <select 
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="input-field appearance-none cursor-pointer pr-10 bg-slate-50 dark:bg-black/50"
                  >
                    {categories.map(cat => <option key={cat} value={cat}>{cat} Risk</option>)}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 uppercase tracking-wider">Scenario Description</label>
                <textarea 
                  name="scenario_description"
                  rows="4"
                  value={formData.scenario_description}
                  onChange={handleChange}
                  placeholder="Describe the specific risk event, triggers, and potential impact..."
                  className="input-field resize-none bg-slate-50 dark:bg-black/50"
                  required
                />
                
                {contradictionWarning && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/30 p-3 rounded-lg text-sm font-bold shadow-inner mt-4"
                  >
                    {contradictionWarning}
                  </motion.div>
                )}
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className={`neon-button w-full mt-auto ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <>
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                  />
                  <span>Running AI Risk Engine...</span>
                </>
              ) : (
                <>
                  <Sparkles size={20} className="text-highlight-electric" />
                  <span>Analyze Risk Scenario</span>
                </>
              )}
            </button>
          </div>

          {/* Right Column: Meter & Slider */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center bg-slate-100/50 dark:bg-black/40 rounded-2xl p-6 border border-slate-200 dark:border-white/5 relative overflow-hidden shadow-inner transition-colors duration-500">
             {/* Subtle background glow for the right panel */}
             <div className="absolute top-[-20%] right-[-20%] w-64 h-64 bg-primary/10 blur-[80px] pointer-events-none mix-blend-screen" />
             
            <RiskMeter score={formData.risk_score} />
            
            <div className="w-full mt-10 px-4 z-10 relative">
              <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-500 uppercase tracking-wider mb-3">
                <span>0</span>
                <span className="text-primary-light">Adjust Score</span>
                <span>100</span>
              </div>
              <input 
                type="range"
                name="risk_score"
                min="0"
                max="100"
                value={formData.risk_score}
                onChange={handleChange}
                className="w-full h-2 bg-slate-300 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary hover:accent-highlight-electric transition-colors"
                style={{
                  background: `linear-gradient(to right, var(--color-primary) ${formData.risk_score}%, transparent ${formData.risk_score}%)`
                }}
              />
            </div>
            
            {/* Severity Badge */}
            <div className={`mt-8 px-6 py-2.5 rounded-full border text-center transition-all duration-300 z-10 flex items-center gap-2 ${
                formData.severity === 'Low' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.15)]' :
                formData.severity === 'Moderate' ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.15)]' :
                formData.severity === 'High' ? 'bg-rose-500/10 border-rose-500/30 text-rose-400 shadow-[0_0_20px_rgba(239,68,68,0.15)]' :
                'bg-purple-500/10 border-purple-500/30 text-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.15)]'
              }`}>
                <AlertTriangle size={16} />
                <span className="text-sm font-bold tracking-widest uppercase">{formData.severity} SEVERITY</span>
            </div>
          </div>

        </form>
      </div>
    </motion.div>
  );
};

export default RiskForm;
