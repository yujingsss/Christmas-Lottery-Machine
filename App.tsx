import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Photo } from './types';
import SlotMachine from './components/SlotMachine';
import PhotoPool from './components/PhotoPool';
import Snowfall from './components/Snowfall';
import GalaxyBackground from './components/GalaxyBackground';
import { RefreshCw, Zap } from 'lucide-react';

// Sound Assets
const SPIN_SOUND_URL = "https://assets.mixkit.co/active_storage/sfx/2044/2044-preview.mp3"; // Sci-fi processing sound
const WIN_SOUND_URL = "https://assets.mixkit.co/active_storage/sfx/1706/1706-preview.mp3"; // Jingle bells

// Default images
const DEFAULT_PHOTOS: Photo[] = [
  { id: 'def-1', url: 'https://picsum.photos/400/500?random=1' },
  { id: 'def-2', url: 'https://picsum.photos/400/500?random=2' },
  { id: 'def-3', url: 'https://picsum.photos/400/500?random=3' },
  { id: 'def-4', url: 'https://picsum.photos/400/500?random=4' },
  { id: 'def-5', url: 'https://picsum.photos/400/500?random=5' },
  { id: 'def-6', url: 'https://picsum.photos/400/500?random=6' },
  { id: 'def-7', url: 'https://picsum.photos/400/500?random=7' },
  { id: 'def-8', url: 'https://picsum.photos/400/500?random=8' },
  { id: 'def-9', url: 'https://picsum.photos/400/500?random=9' },
  { id: 'def-10', url: 'https://picsum.photos/400/500?random=10' },
];

const App: React.FC = () => {
  const [allPhotos, setAllPhotos] = useState<Photo[]>(DEFAULT_PHOTOS);
  const [pickedIds, setPickedIds] = useState<Set<string>>(new Set());
  
  // Visual state
  const [isSpinning, setIsSpinning] = useState<boolean>(true);
  const [currentDisplay, setCurrentDisplay] = useState<Photo[]>([]);

  // Refs
  const loopIntervalRef = useRef<number | null>(null);
  const spinAudioRef = useRef<HTMLAudioElement | null>(null);
  const winAudioRef = useRef<HTMLAudioElement | null>(null);

  // Computed available pool
  const availablePhotos = allPhotos.filter(p => !pickedIds.has(p.id));

  // Initialize Audio
  useEffect(() => {
    spinAudioRef.current = new Audio(SPIN_SOUND_URL);
    spinAudioRef.current.loop = true;
    spinAudioRef.current.volume = 0.3;

    winAudioRef.current = new Audio(WIN_SOUND_URL);
    winAudioRef.current.volume = 0.6;
  }, []);

  // Manage Spin Audio
  useEffect(() => {
    if (spinAudioRef.current) {
      if (isSpinning) {
        // Attempt play - might be blocked until user interaction
        spinAudioRef.current.play().catch(e => console.log("Audio autoplay blocked, waiting for interaction"));
      } else {
        spinAudioRef.current.pause();
        spinAudioRef.current.currentTime = 0;
      }
    }
  }, [isSpinning]);

  // Update loop visual
  const updateLoopDisplay = useCallback(() => {
    if (availablePhotos.length === 0) {
      setCurrentDisplay([null, null, null] as any);
      return;
    }
    
    const randomThree: Photo[] = [];
    for (let i = 0; i < 3; i++) {
        const randomIndex = Math.floor(Math.random() * availablePhotos.length);
        randomThree.push(availablePhotos[randomIndex]);
    }
    setCurrentDisplay(randomThree);
  }, [availablePhotos]);

  // Handle the "Looping"
  useEffect(() => {
    if (isSpinning) {
      loopIntervalRef.current = window.setInterval(updateLoopDisplay, 80); // Faster spin for sci-fi feel
    } else {
      if (loopIntervalRef.current) {
        clearInterval(loopIntervalRef.current);
        loopIntervalRef.current = null;
      }
    }
    return () => {
      if (loopIntervalRef.current) clearInterval(loopIntervalRef.current);
    };
  }, [isSpinning, updateLoopDisplay]);

  // Handle Pick Button
  const handlePick = () => {
    if (availablePhotos.length < 3) {
      alert("Insufficient data in pool. Please upload more assets.");
      return;
    }

    const poolCopy = [...availablePhotos];
    const winners: Photo[] = [];
    
    for (let i = 0; i < 3; i++) {
      const randomIndex = Math.floor(Math.random() * poolCopy.length);
      const winner = poolCopy[randomIndex];
      winners.push(winner);
      poolCopy.splice(randomIndex, 1);
    }

    setCurrentDisplay(winners);
    setIsSpinning(false);
    
    // Play Win Sound
    if (winAudioRef.current) {
        winAudioRef.current.currentTime = 0;
        winAudioRef.current.play().catch(e => console.log("Audio error", e));
    }

    setPickedIds(prev => {
      const newSet = new Set(prev);
      winners.forEach(w => newSet.add(w.id));
      return newSet;
    });
  };

  const handleReset = () => {
    setPickedIds(new Set()); 
    setIsSpinning(true); 
  };
  
  const handlePickClick = () => {
    if (isSpinning) {
      handlePick();
    } else {
      if (availablePhotos.length < 3) {
         alert("Data pool depleted. Reset required.");
         return;
      }
      setIsSpinning(true);
      setTimeout(() => {
        handlePick();
      }, 500); 
    }
  };

  // Pool Management
  const addPhotos = (files: FileList | null) => {
    if (!files) return;
    const newPhotos: Photo[] = Array.from(files).map(file => ({
      id: crypto.randomUUID(),
      url: URL.createObjectURL(file)
    }));
    setAllPhotos(prev => [...prev, ...newPhotos]);
  };

  const removePhoto = (id: string) => {
    setAllPhotos(prev => prev.filter(p => p.id !== id));
    setPickedIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col relative overflow-x-hidden selection:bg-red-500 selection:text-white">
      <GalaxyBackground />
      <Snowfall />

      {/* Header */}
      <header className="p-8 text-center z-10 relative">
        <h2 className="text-blue-400 font-bold tracking-[0.3em] uppercase text-sm md:text-lg mb-2 opacity-80 animate-pulse">
           IDG Marketing
        </h2>
        <h1 className="font-black text-5xl md:text-7xl text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-yellow-600 drop-shadow-[0_0_15px_rgba(234,179,8,0.5)] uppercase tracking-tighter" style={{ fontFamily: 'Orbitron' }}>
          Christmas Lottery
        </h1>
        <div className="h-1 w-32 mx-auto mt-4 bg-gradient-to-r from-transparent via-red-600 to-transparent"></div>
      </header>

      {/* Main Machine */}
      <main className="flex-grow flex flex-col items-center justify-center gap-8 pb-12 w-full px-4">
        
        <SlotMachine 
          currentDisplay={currentDisplay} 
          isSpinning={isSpinning} 
          poolEmpty={availablePhotos.length === 0 && !isSpinning && pickedIds.size === 0}
        />

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-8 items-center z-10 mt-4 w-full justify-center">
          
          <button
            onClick={handleReset}
            className="group relative px-8 py-4 bg-black text-blue-400 font-bold uppercase tracking-widest border border-blue-500/50 hover:bg-blue-900/20 hover:border-blue-400 hover:shadow-[0_0_20px_rgba(0,100,255,0.4)] transition-all flex items-center gap-3 overflow-hidden clip-path-slant"
          >
            <div className="absolute inset-0 bg-blue-500/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <RefreshCw className="group-hover:rotate-180 transition-transform duration-700" size={18} />
            <span className="relative z-10">System Reset</span>
          </button>

          <button
            onClick={handlePickClick}
            disabled={availablePhotos.length < 3 && !isSpinning}
            className={`
              relative px-12 py-5 font-black text-2xl md:text-3xl tracking-wider uppercase
              transition-all active:scale-95 group overflow-hidden
              flex items-center gap-4
              ${availablePhotos.length < 3 && !isSpinning
                ? 'bg-slate-900 text-slate-600 border border-slate-700 cursor-not-allowed' 
                : 'bg-red-900/20 text-red-100 border border-red-500 hover:bg-red-800/40 hover:shadow-[0_0_30px_#f00] sith-glow'
              }
            `}
            style={{
               clipPath: 'polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%)'
            }}
          >
             {/* Button internal flare */}
             <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-red-500/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
             
             <span className="relative z-10 flex items-center gap-3">
               {availablePhotos.length < 3 && !isSpinning ? "POOL DEPLETED" : "MERRY CHRISTMAS!"} 
               {!(availablePhotos.length < 3 && !isSpinning) && <Zap className={isSpinning ? "" : "animate-bounce text-yellow-300"} />}
             </span>
          </button>

        </div>

        {/* Photo Pool Manager */}
        <PhotoPool 
          photos={allPhotos} 
          onAddPhotos={addPhotos} 
          onRemovePhoto={removePhoto} 
          disabled={false}
        />
        
        <div className="z-10 text-center text-xs font-mono uppercase tracking-widest text-slate-500 mt-4">
           POOL STATUS: <span className="text-blue-400">{availablePhotos.length}</span> / <span className="text-slate-300">{allPhotos.length}</span>
        </div>

      </main>
    </div>
  );
};

export default App;