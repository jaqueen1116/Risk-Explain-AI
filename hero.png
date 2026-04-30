import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, LayoutDashboard, AlertTriangle, History, Sparkles } from 'lucide-react';
import FloatingElements from './components/FloatingElements';
import RiskForm from './components/RiskForm';
import ResultCard from './components/ResultCard';
import ThemeToggle from './components/ThemeToggle';
import ModelSelector from './components/ModelSelector';
import AILoader from './components/AILoader';
import CursorGlow from './components/CursorGlow';
import HistoryPage from './components/HistoryPage';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [backendStatus, setBackendStatus] = useState('checking'); 
  const [selectedModel, setSelectedModel] = useState('groq');
  const [error, setError] = useState(null);
  
  const [history, setHistory] = useState(() => {
    const savedHistory = localStorage.getItem('riskHistory');
    if (savedHistory) {
      try {
        return JSON.parse(savedHistory);
      } catch (e) {
        console.error('Failed to parse history:', e);
        return [];
      }
    }
    return [];
  });
  const [loadedFormData, setLoadedFormData] = useState(null);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  useEffect(() => {
    localStorage.setItem('riskHistory', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const res = await fetch('http://localhost:8005/health');
        if (res.ok) setBackendStatus('online');
        else setBackendStatus('offline');
      } catch {
        setBackendStatus('offline');
      }
    };
    checkHealth();
  }, []);

  const handleAnalyze = async (data) => {
    setLoading(true);
    setAnalysis(null);
    setIsThinking(true);
    
    try {
      setError(null);
      const response = await fetch('http://localhost:8005/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...data, selected_model: selectedModel }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.detail?.[0]?.msg || errorData.detail || 'An unexpected error occurred';
        throw new Error(errorMessage);
      }
      
      const result = await response.json();
      
      setTimeout(() => {
        setAnalysis(result);
        setIsThinking(false);
        
        // Save to History with potentially AI-adjusted score
        const overriddenData = {
          ...data,
          risk_score: result.summary.risk_score,
          severity: result.summary.severity
        };

        const newHistoryItem = {
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
          category: data.category,
          risk_score: result.summary.risk_score,
          severity: result.summary.severity,
          formData: overriddenData,
          analysisData: result,
        };
        
        setLoadedFormData(overriddenData); // Sync the UI slider to the adjusted score
        
        setHistory(prev => {
          const updated = [newHistoryItem, ...prev];
          return updated.slice(0, 10); // Keep max 10
        });

        setTimeout(() => {
          document.getElementById('results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 300);
      }, 3500);

    } catch (error) {
      console.error('Analysis failed:', error);
      setError(error.message);
      setIsThinking(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectHistory = (item) => {
    setLoadedFormData(item.formData);
    setAnalysis(item.analysisData);
    setError(null);
    setActiveTab('dashboard'); // Switch back to dashboard
    
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 50);
  };

  const handleClearHistory = () => {
    if (confirm('Are you sure you want to clear your entire analysis history?')) {
      setHistory([]);
    }
  };

  return (
    <div className="relative min-h-screen pb-20 overflow-x-hidden bg-slate-50 dark:bg-[#02040a] text-slate-900 dark:text-white font-sans selection:bg-primary/30 transition-colors duration-500">
      <CursorGlow />
      <FloatingElements />

      {/* Floating Premium Navbar */}
      <div className="fixed top-0 left-0 w-full z-50 px-6 py-4 flex justify-center pointer-events-none">
        <nav className="pointer-events-auto flex items-center justify-between px-6 py-3 bg-white/70 dark:bg-black/40 backdrop-blur-2xl border border-slate-200 dark:border-white/10 shadow-xl dark:shadow-2xl rounded-2xl w-full max-w-6xl transition-all">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-neon-blue border border-white/10">
              <Shield className="text-white" size={22} />
            </div>
            <span className="text-xl font-display font-black tracking-tight uppercase text-slate-900 dark:text-white drop-shadow-md dark:drop-shadow-[0_0_15px_rgba(0,112,243,0.5)]">
              RiskExplain <span className="text-highlight-electric">AI</span>
            </span>
            <div className={`ml-4 hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
              backendStatus === 'online' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.2)]' : 
              backendStatus === 'offline' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20 shadow-[0_0_10px_rgba(239,68,68,0.2)]' :
              'bg-slate-500/10 text-slate-400 border border-slate-500/20'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                 backendStatus === 'online' ? 'bg-emerald-400 animate-pulse' : 
                 backendStatus === 'offline' ? 'bg-rose-400' : 'bg-slate-400'
              }`} />
              {backendStatus}
            </div>
          </div>
          
          <div className="flex items-center gap-2 md:gap-8 text-xs md:text-sm font-bold text-slate-500 dark:text-slate-300 uppercase tracking-wider">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 transition-colors pb-1 relative ${activeTab === 'dashboard' ? 'text-primary dark:text-white' : 'hover:text-slate-800 dark:hover:text-slate-300'}`}
            >
              <LayoutDashboard size={16} className={activeTab === 'dashboard' ? 'text-primary' : ''} />
              <span className="hidden sm:inline">Dashboard</span>
              {activeTab === 'dashboard' && (
                <motion.div layoutId="navIndicator" className="absolute -bottom-[5px] left-0 right-0 h-[2px] bg-primary shadow-[0_0_10px_rgba(0,112,243,0.8)]" />
              )}
            </button>

            <button 
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-2 transition-colors pb-1 relative ${activeTab === 'history' ? 'text-primary dark:text-white' : 'hover:text-slate-800 dark:hover:text-slate-300'}`}
            >
              <History size={16} className={activeTab === 'history' ? 'text-primary' : ''} />
              <span className="hidden sm:inline">History</span>
              {history.length > 0 && activeTab !== 'history' && (
                <span className="absolute -top-2 -right-3 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-primary border border-black text-[8px] items-center justify-center text-white">{history.length}</span>
                </span>
              )}
              {activeTab === 'history' && (
                <motion.div layoutId="navIndicator" className="absolute -bottom-[5px] left-0 right-0 h-[2px] bg-primary shadow-[0_0_10px_rgba(0,112,243,0.8)]" />
              )}
            </button>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />
          </div>
        </nav>
      </div>

      {/* Main Content Area with Routing Transitions */}
      <main className="relative z-10 pt-32 px-6 overflow-x-hidden min-h-screen">
        <AnimatePresence mode="wait">
          
          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard-page"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4 }}
              className="max-w-6xl mx-auto"
            >
              <div className="text-center mb-16 max-w-4xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                  transition={{ duration: 1, ease: "easeOut" }}
                >
                  <h1 className="text-[4rem] md:text-[6.5rem] font-display font-black tracking-tighter mb-6 leading-[1.05] text-gradient-hero drop-shadow-2xl">
                    Intelligent Risk <br />
                    <span className="text-gradient">Communication.</span>
                  </h1>
                </motion.div>
                
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                  className="text-slate-600 dark:text-slate-400 text-xl font-medium leading-relaxed text-balance max-w-2xl mx-auto"
                >
                  Transform complex financial risks into actionable, premium insights 
                  using state-of-the-art AI. Built for elite compliance officers.
                </motion.p>
              </div>

              <div className="flex flex-col items-center w-full">
                <div className="w-full relative z-20">
                  <div className="flex justify-center mb-6">
                    <ModelSelector activeModel={selectedModel} onSelect={setSelectedModel} />
                  </div>
                  <RiskForm onSubmit={handleAnalyze} isLoading={loading} initialData={loadedFormData} />
                </div>

                <div className="w-full relative z-10">
                  <AnimatePresence mode="wait">
                    {isThinking && (
                      <motion.div 
                        key="loader"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -30 }}
                        className="max-w-2xl mx-auto w-full mb-20"
                      >
                        <AILoader />
                      </motion.div>
                    )}

                    {error && !isThinking && (
                      <motion.div 
                        key="error"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="max-w-2xl mx-auto w-full p-6 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex flex-col items-center gap-4 text-center mb-20 shadow-[0_0_30px_rgba(239,68,68,0.15)]"
                      >
                        <div className="w-12 h-12 rounded-full bg-rose-500/20 flex items-center justify-center border border-rose-500/30">
                          <AlertTriangle size={24} />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-slate-900 dark:text-white">Analysis Failed</h3>
                          <p className="text-sm opacity-80 mt-1">{error}</p>
                        </div>
                        <button 
                          onClick={() => setError(null)}
                          className="px-6 py-2.5 bg-rose-500/20 hover:bg-rose-500/30 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border border-rose-500/20 hover:border-rose-500/50"
                        >
                          Dismiss Error
                        </button>
                      </motion.div>
                    )}

                    {analysis && analysis.adjustment_warning && !isThinking && !error && (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-4xl mx-auto mb-8 p-4 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center gap-3 font-bold shadow-[0_0_20px_rgba(168,85,247,0.15)]"
                      >
                        <Sparkles size={18} />
                        {analysis.adjustment_warning}
                      </motion.div>
                    )}

                    {analysis && !isThinking && !error && (
                      <motion.div 
                        key="results"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 scroll-mt-32 w-full mb-20"
                        id="results"
                      >
                        <div className="md:col-span-2 xl:col-span-2">
                           <ResultCard title="Expert Risk Analysis" content={analysis.explanation} type="explanation" delay={0.1} />
                        </div>
                        <div className="md:col-span-1 xl:col-span-1">
                          <ResultCard title="Risk Trend" content={[{ label: "Current Trend", value: analysis.risk_assessment.trend }]} type="summary" delay={0.2} />
                        </div>
                        <div className="md:col-span-1 xl:col-span-1">
                           <ResultCard title="AI Confidence" content={[{ label: "Confidence", value: `${analysis.confidence_score}%` }]} type="summary" delay={0.3} />
                        </div>
                        <div className="md:col-span-2 xl:col-span-2">
                          <ResultCard title="Prioritized Mitigations" content={analysis.mitigation} type="mitigations" delay={0.4} />
                        </div>
                        <div className="md:col-span-1 xl:col-span-1">
                          <ResultCard title="Control Summary" content={[{ label: "Category", value: analysis.summary.category }, { label: "Key Issue", value: analysis.summary.key_issue }, { label: "Potential Impact", value: analysis.summary.impact }]} type="summary" delay={0.5} />
                        </div>
                        <div className="md:col-span-1 xl:col-span-1">
                          <ResultCard title="Compliance Draft" content={analysis.compliance} type="compliance" delay={0.6} />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'history' && (
            <motion.div
              key="history-page"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
            >
              <HistoryPage history={history} onSelect={handleSelectHistory} onClear={handleClearHistory} />
            </motion.div>
          )}
          
        </AnimatePresence>
      </main>

      {/* Footer Loading Bar */}
      {loading && (
        <div className="fixed bottom-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-highlight-electric to-secondary animate-loading-bar z-50 shadow-[0_0_20px_rgba(0,223,216,0.8)]" />
      )}
    </div>
  );
}

export default App;
