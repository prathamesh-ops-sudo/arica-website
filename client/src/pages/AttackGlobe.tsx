import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { ChevronLeft, Shield, AlertTriangle, Clock, Zap, Target, Globe2, Activity, ShieldCheck, ShieldAlert, ArrowRight, Search, Filter, X } from "lucide-react";
import { useState, useEffect, useCallback } from "react";

const attackTypes = [
  { id: 'ddos', name: 'DDoS Attack', color: '#ff3344' },
  { id: 'sql', name: 'SQL Injection', color: '#ff9900' },
  { id: 'xss', name: 'XSS Attack', color: '#ffcc00' },
  { id: 'bruteforce', name: 'Brute Force', color: '#ff00ff' },
  { id: 'malware', name: 'Malware', color: '#00ffff' },
  { id: 'phishing', name: 'Phishing', color: '#ff6666' },
  { id: 'ransomware', name: 'Ransomware', color: '#cc00ff' },
];

const cities = [
  'Moscow, Russia',
  'Beijing, China',
  'New York, USA',
  'London, UK',
  'Tokyo, Japan',
  'São Paulo, Brazil',
  'Mumbai, India',
  'Sydney, Australia',
  'Paris, France',
  'Seoul, South Korea',
  'Berlin, Germany',
  'Toronto, Canada',
  'Singapore',
  'Dubai, UAE',
  'Hong Kong',
  'Los Angeles, USA',
  'Shanghai, China',
  'Amsterdam, Netherlands',
  'Stockholm, Sweden',
  'Tel Aviv, Israel',
];

interface Attack {
  id: number;
  from: string;
  to: string;
  type: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  time: string;
  isNew?: boolean;
}

export default function AttackGlobe() {
  const [liveCounter, setLiveCounter] = useState(2847);
  const [seconds, setSeconds] = useState(39);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [attacks, setAttacks] = useState<Attack[]>([]);
  const [attackIdCounter, setAttackIdCounter] = useState(0);

  const generateRandomAttack = useCallback((): Attack => {
    const fromCity = cities[Math.floor(Math.random() * cities.length)];
    let toCity = cities[Math.floor(Math.random() * cities.length)];
    while (toCity === fromCity) {
      toCity = cities[Math.floor(Math.random() * cities.length)];
    }
    const type = attackTypes[Math.floor(Math.random() * attackTypes.length)];
    const severities: Attack['severity'][] = ['critical', 'high', 'medium', 'low'];
    const severity = severities[Math.floor(Math.random() * severities.length)];
    
    return {
      id: Date.now() + Math.random(),
      from: fromCity,
      to: toCity,
      type: type.name,
      severity,
      time: 'just now',
      isNew: true,
    };
  }, []);

  useEffect(() => {
    const initialAttacks: Attack[] = [];
    for (let i = 0; i < 8; i++) {
      const attack = generateRandomAttack();
      attack.id = i;
      attack.time = `${(i + 1) * 2}s ago`;
      attack.isNew = false;
      initialAttacks.push(attack);
    }
    setAttacks(initialAttacks);
    setAttackIdCounter(8);
  }, [generateRandomAttack]);

  useEffect(() => {
    const addAttack = () => {
      const newAttack = generateRandomAttack();
      newAttack.id = attackIdCounter;
      setAttackIdCounter(prev => prev + 1);
      
      setAttacks(prev => {
        const updated = prev.map(a => ({ ...a, isNew: false }));
        const newList = [newAttack, ...updated].slice(0, 12);
        return newList;
      });
      
      setLiveCounter(prev => prev + 1);
    };

    const randomInterval = () => Math.floor(Math.random() * 2000) + 1000;
    
    let timeoutId: NodeJS.Timeout;
    const scheduleNext = () => {
      timeoutId = setTimeout(() => {
        addAttack();
        scheduleNext();
      }, randomInterval());
    };
    
    scheduleNext();
    return () => clearTimeout(timeoutId);
  }, [attackIdCounter, generateRandomAttack]);

  useEffect(() => {
    const interval = setInterval(() => {
      setAttacks(prev => prev.map(attack => {
        const timeMatch = attack.time.match(/(\d+)s ago/);
        if (attack.time === 'just now') {
          return { ...attack, time: '1s ago' };
        } else if (timeMatch) {
          const secs = parseInt(timeMatch[1]) + 1;
          return { ...attack, time: `${secs}s ago` };
        }
        return attack;
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(prev => {
        if (prev <= 1) return 39;
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const filteredAttacks = attacks.filter(attack => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (!attack.from.toLowerCase().includes(query) &&
          !attack.to.toLowerCase().includes(query) &&
          !attack.type.toLowerCase().includes(query)) {
        return false;
      }
    }
    if (selectedTypes.length > 0) {
      if (!selectedTypes.some(type => attack.type.toLowerCase().includes(type.toLowerCase()))) {
        return false;
      }
    }
    return true;
  });
  
  const toggleTypeFilter = (typeId: string) => {
    setSelectedTypes(prev => 
      prev.includes(typeId) ? prev.filter(t => t !== typeId) : [...prev, typeId]
    );
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-500 bg-red-500/20 border-red-500/50';
      case 'high': return 'text-orange-500 bg-orange-500/20 border-orange-500/50';
      case 'medium': return 'text-yellow-500 bg-yellow-500/20 border-yellow-500/50';
      case 'low': return 'text-green-500 bg-green-500/20 border-green-500/50';
      default: return 'text-white/50 bg-white/10 border-white/20';
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a1e] relative overflow-hidden">
      <iframe 
        src="https://clara.io/embed/d8f7f934-c140-43ea-a765-97d08cd4e841?renderer=webgl"
        className="absolute inset-0 w-full h-full border-0"
        style={{ zIndex: 1 }}
        allowFullScreen
        title="Earth Globe"
      />
      
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a1e]/30 via-transparent to-[#0a0a1e]/80 pointer-events-none" style={{ zIndex: 2 }} />
      
      <div className="relative" style={{ zIndex: 10 }}>
        <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[#0a0a1e]/80 border-b border-[#00D4FF]/10">
          <div className="container mx-auto px-6 py-4 flex items-center justify-between">
            <Link 
              href="/experience"
              className="flex items-center gap-2 text-[#00D4FF] hover:text-white transition-colors text-sm font-medium"
              data-testid="link-back-experience"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to Experience</span>
            </Link>
            
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 text-white/60 text-sm">
                <Activity className="w-4 h-4 text-[#00D4FF]" />
                <span>Live Monitoring</span>
              </div>
              <motion.div 
                className="flex items-center gap-2 bg-[#ff3344]/10 px-4 py-2 rounded-full border border-[#ff3344]/30"
                animate={{ 
                  boxShadow: ['0 0 10px rgba(255,51,68,0.2)', '0 0 25px rgba(255,51,68,0.4)', '0 0 10px rgba(255,51,68,0.2)']
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <motion.div 
                  className="w-2 h-2 rounded-full bg-[#ff3344]"
                  animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                <span className="text-xs text-[#ff3344] font-bold uppercase tracking-wider">Live</span>
              </motion.div>
            </div>
          </div>
        </header>

        <main className="pt-24 pb-12 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-8"
            >
              <motion.div 
                className="inline-flex items-center gap-3 bg-[#ff3344]/10 border border-[#ff3344]/30 rounded-full px-6 py-2 mb-6 backdrop-blur-xl"
                animate={{ 
                  boxShadow: ['0 0 15px rgba(255,51,68,0.1)', '0 0 30px rgba(255,51,68,0.2)', '0 0 15px rgba(255,51,68,0.1)']
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <AlertTriangle className="w-4 h-4 text-[#ff3344]" />
                <span className="text-[#ff3344] font-medium text-sm">Global Threat Intelligence Active</span>
              </motion.div>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 tracking-tight">
                <span className="text-white drop-shadow-lg">Real-Time </span>
                <span className="bg-gradient-to-r from-[#00D4FF] to-[#00ff88] bg-clip-text text-transparent">Cyber Attack</span>
                <br />
                <span className="text-white drop-shadow-lg">Monitoring</span>
              </h1>
              
              <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto mb-8 drop-shadow-lg">
                Witness the invisible war. Every second, thousands of attacks target businesses worldwide.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8"
            >
              <div className="backdrop-blur-xl bg-[#0a0a1e]/70 border border-white/10 rounded-2xl p-5 group hover:border-[#ff3344]/30 transition-all duration-500">
                <div className="flex items-center justify-between mb-3">
                  <Clock className="w-5 h-5 text-[#ff3344]" />
                  <motion.span 
                    className="text-[#ff3344] text-2xl font-bold font-mono"
                    key={seconds}
                    initial={{ scale: 1.2, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                  >
                    {seconds}s
                  </motion.span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-1">Every 39</h3>
                <p className="text-white/40 text-sm">Seconds a Hack Occurs</p>
              </div>
              
              <div className="backdrop-blur-xl bg-[#0a0a1e]/70 border border-white/10 rounded-2xl p-5 group hover:border-[#00D4FF]/30 transition-all duration-500">
                <div className="flex items-center justify-between mb-3">
                  <Target className="w-5 h-5 text-[#00D4FF]" />
                  <Zap className="w-4 h-4 text-[#00D4FF] animate-pulse" />
                </div>
                <motion.h3 
                  className="text-2xl md:text-3xl font-bold text-white mb-1"
                  key={liveCounter}
                  initial={{ scale: 1.05 }}
                  animate={{ scale: 1 }}
                >
                  {liveCounter.toLocaleString()}
                </motion.h3>
                <p className="text-white/40 text-sm">Attacks Detected Today</p>
              </div>
              
              <div className="backdrop-blur-xl bg-[#0a0a1e]/70 border border-white/10 rounded-2xl p-5 group hover:border-yellow-500/30 transition-all duration-500">
                <div className="flex items-center justify-between mb-3">
                  <ShieldAlert className="w-5 h-5 text-yellow-500" />
                  <span className="text-[10px] text-yellow-500/70 uppercase font-medium">2025</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-1">$4.45M</h3>
                <p className="text-white/40 text-sm">Avg. Breach Cost</p>
              </div>
              
              <div className="backdrop-blur-xl bg-[#0a0a1e]/70 border border-white/10 rounded-2xl p-5 group hover:border-purple-500/30 transition-all duration-500">
                <div className="flex items-center justify-between mb-3">
                  <Globe2 className="w-5 h-5 text-purple-400" />
                  <span className="text-[10px] text-purple-400/70 uppercase font-medium">Global</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-1">$10.5T</h3>
                <p className="text-white/40 text-sm">Annual Cybercrime Cost</p>
              </div>
            </motion.div>

            <div className="flex justify-end mb-8">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="w-full lg:w-96 space-y-4"
              >
                <div className="backdrop-blur-xl bg-[#0a0a1e]/70 border border-white/10 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Search className="w-4 h-4 text-[#00D4FF]" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search attacks..."
                      className="flex-1 bg-transparent border-none outline-none text-sm text-white placeholder:text-white/30"
                      data-testid="input-search-attacks"
                    />
                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className={`p-1.5 rounded-lg transition-all ${showFilters ? 'bg-[#00D4FF]/20 text-[#00D4FF]' : 'text-white/50 hover:text-white'}`}
                      data-testid="btn-toggle-filters"
                    >
                      <Filter className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <AnimatePresence>
                    {showFilters && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="flex flex-wrap gap-2 pt-3 border-t border-white/10">
                          {attackTypes.map((type) => (
                            <button
                              key={type.id}
                              onClick={() => toggleTypeFilter(type.id)}
                              className={`px-2 py-1 rounded-full text-xs font-medium transition-all ${
                                selectedTypes.includes(type.id)
                                  ? 'text-white'
                                  : 'text-white/50 hover:text-white'
                              }`}
                              style={{
                                backgroundColor: selectedTypes.includes(type.id) ? `${type.color}30` : 'transparent',
                                borderWidth: 1,
                                borderColor: selectedTypes.includes(type.id) ? type.color : 'rgba(255,255,255,0.1)'
                              }}
                              data-testid={`filter-${type.id}`}
                            >
                              {type.name}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="backdrop-blur-xl bg-[#0a0a1e]/70 border border-white/10 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                      <Activity className="w-4 h-4 text-[#ff3344]" />
                      Live Attack Feed
                    </h3>
                    <motion.div 
                      className="w-2 h-2 rounded-full bg-[#ff3344]"
                      animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                  </div>
                  <div className="space-y-2 max-h-[400px] overflow-y-auto">
                    <AnimatePresence mode="popLayout">
                      {filteredAttacks.length > 0 ? (
                        filteredAttacks.map((attack) => (
                          <motion.div
                            key={attack.id}
                            initial={{ opacity: 0, x: -20, scale: 0.95 }}
                            animate={{ 
                              opacity: 1, 
                              x: 0, 
                              scale: 1,
                              boxShadow: attack.isNew ? ['0 0 0 rgba(255,51,68,0)', '0 0 20px rgba(255,51,68,0.5)', '0 0 0 rgba(255,51,68,0)'] : 'none'
                            }}
                            exit={{ opacity: 0, x: 20, scale: 0.95 }}
                            transition={{ 
                              duration: 0.3,
                              boxShadow: attack.isNew ? { duration: 0.5, times: [0, 0.5, 1] } : undefined
                            }}
                            layout
                            className={`p-3 rounded-xl bg-black/40 border transition-all ${
                              attack.isNew ? 'border-[#ff3344]/50' : 'border-white/5 hover:border-[#ff3344]/30'
                            }`}
                            data-testid={`attack-${attack.id}`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase border ${getSeverityColor(attack.severity)}`}>
                                {attack.severity}
                              </span>
                              <span className="text-[10px] text-white/40">{attack.time}</span>
                            </div>
                            <p className="text-xs text-white/70">{attack.type}</p>
                            <p className="text-[10px] text-white/40 mt-1">
                              {attack.from} → {attack.to}
                            </p>
                          </motion.div>
                        ))
                      ) : (
                        <div className="text-center py-4 text-white/40 text-sm">
                          No attacks match your filters
                        </div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="mt-8 text-center"
            >
              <div className="backdrop-blur-xl bg-gradient-to-r from-[#00D4FF]/10 via-[#00D4FF]/20 to-[#00D4FF]/10 border border-[#00D4FF]/20 rounded-3xl p-8 md:p-12 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#00D4FF]/5 via-transparent to-transparent" />
                
                <div className="relative z-10">
                  <div className="flex items-center justify-center gap-4 mb-6">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    >
                      <Shield className="w-10 h-10 text-[#00D4FF]" />
                    </motion.div>
                    <div className="text-left">
                      <h2 className="text-2xl md:text-3xl font-bold text-white">Don't Be a Statistic</h2>
                      <p className="text-[#00D4FF]/70 text-sm">95% of breaches are preventable with proper security</p>
                    </div>
                  </div>
                  
                  <p className="text-white/60 max-w-2xl mx-auto mb-8 text-lg">
                    Our <span className="text-[#00D4FF] font-semibold">Vulnerability Assessment & Penetration Testing (VAPT)</span> identifies 
                    your security gaps before attackers do. Get a comprehensive security audit from certified experts.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link 
                      href="/contact"
                      className="group inline-flex items-center justify-center gap-3 bg-gradient-to-r from-[#00D4FF] to-[#00ff88] text-[#0a0a1e] font-bold px-8 py-4 rounded-full hover:shadow-[0_0_40px_rgba(0,212,255,0.4)] transition-all duration-300"
                      data-testid="link-get-vapt"
                    >
                      <ShieldCheck className="w-5 h-5" />
                      <span>Get Free Security Assessment</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    
                    <Link 
                      href="/services"
                      className="inline-flex items-center justify-center gap-2 text-white/70 hover:text-white border border-white/20 hover:border-white/40 px-6 py-4 rounded-full transition-all duration-300"
                      data-testid="link-learn-more"
                    >
                      Explore Our Services
                    </Link>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-6 mt-10 max-w-2xl mx-auto">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-[#00D4FF]">500+</div>
                      <p className="text-white/40 text-sm mt-1">Audits Completed</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-[#00D4FF]">99.9%</div>
                      <p className="text-white/40 text-sm mt-1">Client Satisfaction</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-[#00D4FF]">24/7</div>
                      <p className="text-white/40 text-sm mt-1">Monitoring Available</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="mt-8 text-center"
            >
              <p className="text-white/30 text-xs">
                Data sources: IBM Security, University of Maryland, Cybersecurity Ventures (2025)
              </p>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}
