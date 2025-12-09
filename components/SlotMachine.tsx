import React from 'react';
import { Photo, SlotMachineProps } from '../types';
import { Gift, Zap } from 'lucide-react';

const SlotMachine: React.FC<SlotMachineProps> = ({ currentDisplay, isSpinning, poolEmpty }) => {
  return (
    <div className="w-full max-w-5xl mx-auto p-4 relative z-10">
      {/* Main Container - The "Machine" */}
      <div className={`relative bg-black/80 backdrop-blur-sm rounded-lg p-8 border border-red-900 transition-all duration-500 ${isSpinning ? 'shadow-[0_0_40px_rgba(200,0,0,0.3)]' : 'shadow-[0_0_60px_rgba(0,255,0,0.2)]'}`}>
        
        {/* Lightsaber Borders */}
        <div className={`absolute top-0 left-0 right-0 h-1 ${isSpinning ? 'bg-red-600 shadow-[0_0_15px_#f00]' : 'bg-green-500 shadow-[0_0_15px_#0f0]'}`}></div>
        <div className={`absolute bottom-0 left-0 right-0 h-1 ${isSpinning ? 'bg-red-600 shadow-[0_0_15px_#f00]' : 'bg-green-500 shadow-[0_0_15px_#0f0]'}`}></div>

        {/* Tech Decor Lights */}
        <div className="flex justify-between mb-8 opacity-80">
          <div className="flex gap-2">
            {[1,2,3].map(i => (
              <div key={i} className={`w-8 h-2 ${isSpinning ? 'bg-red-500 animate-pulse' : 'bg-green-500'} skew-x-12`} style={{animationDelay: `${i*0.1}s`}}></div>
            ))}
          </div>
          <div className="flex gap-2">
             {[1,2,3].map(i => (
              <div key={i} className={`w-8 h-2 ${isSpinning ? 'bg-red-500 animate-pulse' : 'bg-green-500'} -skew-x-12`} style={{animationDelay: `${i*0.1}s`}}></div>
            ))}
          </div>
        </div>

        <div className="text-center mb-10">
           <h2 className={`text-4xl md:text-6xl font-black uppercase tracking-widest ${isSpinning ? 'text-red-500 drop-shadow-[0_0_10px_rgba(255,0,0,0.8)]' : 'text-green-400 drop-shadow-[0_0_10px_rgba(0,255,0,0.8)]'}`}>
             {isSpinning ? "Scanning..." : "Targets Acquired"}
           </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, index) => {
             const photo = currentDisplay[index];
             return (
               <div key={index} className="relative aspect-[4/5] bg-black rounded-lg overflow-hidden border border-slate-700 shadow-lg group">
                  {/* Holo Overlay effect */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-20 pointer-events-none bg-[length:100%_2px,3px_100%]"></div>
                  
                  {photo ? (
                    <img 
                      src={photo.url} 
                      alt="Picked" 
                      className={`w-full h-full object-cover transition-all duration-100 ${isSpinning ? 'opacity-80 scale-110 blur-[1px] saturate-150' : 'opacity-100 scale-100'}`} 
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-600 bg-slate-900/50">
                       {poolEmpty ? (
                         <span className="text-center px-4 font-mono text-xs text-red-500 tracking-widest">DATA POOL EMPTY</span>
                       ) : (
                         <Zap size={48} className="opacity-20 mb-2 animate-pulse" />
                       )}
                       <span className="text-xs font-mono uppercase mt-2">{poolEmpty ? "UPLOAD REQUIRED" : "INITIALIZING"}</span>
                    </div>
                  )}
                  
                  {/* Selection Border - Active when picked */}
                  {!isSpinning && photo && (
                    <div className="absolute inset-0 border-2 border-green-500 shadow-[inset_0_0_20px_rgba(0,255,0,0.5)] z-30">
                      <div className="absolute top-2 left-2 bg-green-500 text-black text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider">
                        Subject #{index + 1}
                      </div>
                    </div>
                  )}
                  
                  {/* Scanning Border - Active when spinning */}
                  {isSpinning && (
                     <div className="absolute inset-0 border border-red-500/30 z-30">
                        <div className="absolute top-0 w-full h-1 bg-red-500/50 shadow-[0_0_10px_#f00] animate-[scan_1s_ease-in-out_infinite]"></div>
                     </div>
                  )}
               </div>
             );
          })}
        </div>
      </div>
      
      <style>{`
        @keyframes scan {
          0% { top: 0%; opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default SlotMachine;