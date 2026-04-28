/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, SkipForward, Volume2, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Track {
  id: string;
  title: string;
  artist: string;
  url: string;
  cover: string;
}

const DUMMY_TRACKS: Track[] = [
  {
    id: '1',
    title: 'Neon Drift',
    artist: 'AI Virtuoso',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    cover: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: '2',
    title: 'Cyber Pulse',
    artist: 'Digital Dreamer',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    cover: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: '3',
    title: 'Synth Wave Rider',
    artist: 'Future Sonic',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    cover: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1964&auto=format&fit=crop',
  },
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const currentProgress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(currentProgress || 0);
    }
  };

  const handleNext = useCallback(() => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    setProgress(0);
  }, []);

  const togglePlay = () => setIsPlaying(!isPlaying);

  return (
    <div className="flex flex-col gap-6 p-6 bg-black border-4 border-double border-magenta-500 h-full relative" id="music-player-container">
      <div className="flex items-center justify-between border-b border-magenta-500/30 pb-4" id="now-playing-header">
        <div className="flex items-center gap-2" id="music-label-wrapper">
          <Music className="w-4 h-4 text-magenta-500" id="music-icon" />
          <h2 className="text-[12px] font-bold tracking-[0.3em] text-magenta-500 uppercase font-mono" id="now-playing-label">AUDIO_BUFFER</h2>
        </div>
        <div className="flex gap-1" id="deco-dots">
           <div className="w-1 h-1 bg-cyan-500" />
           <div className="w-1 h-1 bg-magenta-500" />
        </div>
      </div>

      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleNext}
      />

      <div className="flex flex-col gap-6 flex-1 items-center justify-center" id="track-info-container">
        <motion.div 
          key={currentTrack.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative"
          id="album-art-wrapper"
        >
          <div className="absolute -right-2 -bottom-2 w-full h-full border-2 border-cyan-500 -z-10" id="art-offset-border" />
          <img 
            src={currentTrack.cover} 
            alt={currentTrack.title}
            className="w-40 h-40 object-cover border-2 border-white relative z-10 grayscale contrast-125 hover:grayscale-0 transition-all duration-500"
            referrerPolicy="no-referrer"
            id="album-art"
          />
        </motion.div>

        <div className="text-center w-full" id="text-info">
          <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase mb-1" id="track-title">{currentTrack.title}</h3>
          <div className="inline-block bg-white text-black px-2 py-0.5 text-[10px] font-bold font-mono tracking-widest" id="track-artist-badge">
            {currentTrack.artist.toUpperCase()}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6" id="controls-container">
        <div className="relative h-6 bg-gray-900 border border-white/10 overflow-hidden" id="progress-container">
          <div className="absolute inset-0 flex items-center justify-center text-[10px] uppercase font-mono text-white/20 z-10 pointer-events-none" id="progress-bg-text">STREAM_DATA_SYNCING...</div>
          <motion.div 
            className="h-full bg-cyan-500 opacity-60"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ type: 'spring', bounce: 0, duration: 0.1 }}
            id="progress-bar-fill"
          />
        </div>

        <div className="grid grid-cols-3 items-center" id="controls-row">
          <div className="text-[10px] font-mono text-magenta-500 font-bold" id="time-indicator">
            {Math.floor(progress)}%_SYNCED
          </div>

          <div className="flex items-center justify-center gap-4" id="playback-controls">
            <button 
              onClick={togglePlay}
              className="w-12 h-12 flex items-center justify-center bg-magenta-500 border-2 border-white text-black hover:bg-cyan-500 hover:text-white transition-all transform active:scale-90"
              id="play-pause-button"
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-current" id="pause-icon" /> : <Play className="w-5 h-5 fill-current ml-1" id="play-icon" />}
            </button>
            <button 
              onClick={handleNext}
              className="w-10 h-10 border-2 border-white/20 flex items-center justify-center text-white hover:border-cyan-500 hover:text-cyan-500 transition-all"
              id="skip-button"
            >
              <SkipForward className="w-5 h-5" id="skip-icon" />
            </button>
          </div>

          <div className="flex justify-end pr-2 overflow-hidden" id="level-indicator">
             <div className="flex gap-1" id="level-bars">
                {[...Array(6)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-1 h-3 ${i < 4 ? 'bg-cyan-500' : 'bg-gray-800'} animate-pulse`} 
                    style={{ animationDelay: `${i * 0.1}s` }}
                  />
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
