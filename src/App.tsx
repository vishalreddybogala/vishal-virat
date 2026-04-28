/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { motion } from 'motion/react';
import { Zap, Share2, Info } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans relative overflow-hidden crt-overlay" id="app-root">
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0 opacity-40" id="background-ambience">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/20 blur-[120px] rounded-full animate-pulse" id="glow-cyan" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-magenta-500/20 blur-[120px] rounded-full animate-pulse" id="glow-magenta" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,0,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px]" id="grid-pattern" />
      </div>

      {/* Navigation */}
      <header className="relative z-10 px-8 py-4 flex justify-between items-center border-b-2 border-magenta-500/30 bg-black/80 backdrop-blur-md" id="main-header">
        <div className="flex items-center gap-4" id="logo-section">
          <div className="p-2 bg-black border-2 border-cyan-500 shadow-[2px_2px_0px_#ff00ff]" id="logo-icon-wrapper">
            <Zap className="w-5 h-5 text-cyan-400 fill-cyan-400" id="logo-icon" />
          </div>
          <h1 className="text-2xl font-bold tracking-widest uppercase glitch-text" data-text="NEON_RHYTHM_v1.0" id="app-name">
            NEON_RHYTHM_v1.0
          </h1>
        </div>

        <nav className="hidden md:flex items-center gap-12 text-[12px] uppercase tracking-[0.3em] font-bold" id="main-nav">
          <a href="#" className="text-magenta-500 hover:text-white transition-all border-b-2 border-transparent hover:border-magenta-500 px-1" id="nav-arcade">SYSTEM_ARCADE</a>
          <a href="#" className="text-cyan-500 hover:text-white transition-all border-b-2 border-transparent hover:border-cyan-500 px-1" id="nav-network">PROTO_NET</a>
          <a href="#" className="text-gray-600 hover:text-white transition-all" id="nav-archive">LOG_ARCHIVE</a>
        </nav>

        <div className="flex items-center gap-6" id="header-actions">
           <button className="text-cyan-500 hover:scale-110 active:scale-95 transition-transform" id="info-button">
             <Info className="w-5 h-5" id="info-icon" />
           </button>
           <div className="w-10 h-10 border-2 border-magenta-500 rounded-full flex items-center justify-center animate-spin-slow" id="header-spinner">
             <Share2 className="w-4 h-4 text-magenta-400" />
           </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-[1600px] mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start" id="main-content">
        {/* Left Side: Game Stage */}
        <section className="lg:col-span-7 flex flex-col gap-10" id="game-section">
           <motion.div
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ duration: 1, ease: "circOut" }}
             className="screen-tear"
             id="game-animation-wrapper"
           >
             <div className="relative p-1 bg-gradient-to-tr from-cyan-500 via-transparent to-magenta-500 rounded-2xl" id="game-border">
                <SnakeGame />
             </div>
           </motion.div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono" id="stats-row">
             {[
               { label: 'UPLINK_DELAY', value: '1.4ms', color: 'text-cyan-400' },
               { label: 'SIGNAL_INTEGRITY', value: '99.8%', color: 'text-magenta-400' },
               { label: 'CORE_TEMP', value: '72°C', color: 'text-yellow-400' }
             ].map((stat, i) => (
               <div key={i} className="bg-black border-2 border-gray-800 p-4 relative group" id={`stat-card-${i}`}>
                 <div className="absolute top-0 right-0 w-2 h-2 bg-gray-700" />
                 <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-2" id={`stat-label-${i}`}>[{stat.label}]</div>
                 <div className="flex justify-between items-center" id={`stat-values-${i}`}>
                    <div className={`text-xl font-bold ${stat.color} group-hover:scale-110 transition-transform`} id={`stat-value-${i}`}>{stat.value}</div>
                    <div className="w-4 h-4 bg-white/5 rounded-sm animate-pulse" />
                 </div>
               </div>
             ))}
           </div>
        </section>

        {/* Right Side: Media Control */}
        <aside className="lg:col-span-5 h-full" id="music-sidebar">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="sticky top-24 flex flex-col gap-8"
            id="music-animation-wrapper"
          >
             <div className="border-4 border-double border-white/10 p-2 bg-black/40" id="player-wrapper">
                <MusicPlayer />
             </div>
            
            {/* Terminal Log */}
            <div className="bg-black border-2 border-magenta-500/20 p-6 font-mono text-[11px] h-48 overflow-y-auto" id="terminal-log">
               <h4 className="text-magenta-400 mb-3 border-b border-magenta-500/20 pb-2 uppercase tracking-widest font-bold" id="log-title">BUFFER_MANIFEST</h4>
               <div className="space-y-1 text-gray-400" id="log-content">
                 <p className="text-cyan-400">{">"} INITIALIZING_AUDIO_STREAM_v2.0</p>
                 <p>{">"} LOADING_SYNTH_WAVE_PACK... [OK]</p>
                 <p>{">"} FREQUENCY_ALIGNMENT: 44.1kHz</p>
                 <p className="animate-pulse">{">"} DETECTING_RHYTHM_ANOMALIES...</p>
                 <p>{">"} TRACK_04: DIGITAL_RAIN [QUEUED]</p>
                 <p>{">"} TRACK_05: GLITCH_HOPE [QUEUED]</p>
                 <p className="text-magenta-400">{">"} SIGNAL_STRENGTH: NOMINAL</p>
               </div>
            </div>
          </motion.div>
        </aside>
      </main>

      {/* Footer / Status Bar */}
      <footer className="relative z-10 border-t-2 border-cyan-500/30 px-8 py-3 flex justify-between items-center text-[11px] text-cyan-400/50 font-mono uppercase tracking-[0.2em] bg-black" id="main-footer">
        <div id="build-version" className="glitch-text" data-text="BUILD_X77_RE_STABLE">BUILD_X77_RE_STABLE</div>
        <div className="flex gap-8" id="footer-links">
           <span className="flex items-center gap-3" id="status-indicator">
             <div className="w-2 h-2 bg-magenta-500 border border-white animate-ping" id="status-dot" />
             RHYTHM_SYNC: ACTIVE
           </span>
           <span id="region-info" className="hidden sm:inline">LOC: CYBER_SPACE_NODE_09</span>
        </div>
      </footer>
    </div>
  );
}

