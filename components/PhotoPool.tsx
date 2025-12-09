import React from 'react';
import { PhotoPoolProps } from '../types';
import { Trash2, Upload, Image as ImageIcon, Database } from 'lucide-react';

const PhotoPool: React.FC<PhotoPoolProps> = ({ photos, onAddPhotos, onRemovePhoto, disabled }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onAddPhotos(e.target.files);
    e.target.value = ''; // Reset input
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-8 relative z-10">
      <div className="bg-black/40 backdrop-blur-md rounded-none border border-slate-700 p-6 relative overflow-hidden">
        {/* Decorative corner accents */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-blue-500"></div>
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-blue-500"></div>
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-blue-500"></div>
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-blue-500"></div>

        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div className="flex items-center gap-3">
            <Database className="text-blue-400" size={24} />
            <h3 className="text-xl md:text-2xl font-bold text-blue-100 tracking-wider uppercase">Data Pool <span className="text-blue-500 text-sm align-top">[{photos.length}]</span></h3>
          </div>
          
          <label className={`cursor-pointer group relative flex items-center gap-2 px-8 py-2 bg-blue-900/30 hover:bg-blue-800/50 transition-all border border-blue-500/50 hover:border-blue-400 ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
            <Upload size={16} className="text-blue-400 group-hover:text-white transition-colors" />
            <span className="font-bold text-sm tracking-widest text-blue-200 group-hover:text-white uppercase">Upload Data</span>
            <input 
              type="file" 
              multiple 
              accept="image/*" 
              className="hidden" 
              onChange={handleFileChange}
              disabled={disabled}
            />
          </label>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
          {photos.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-12 text-slate-600 border border-dashed border-slate-800 bg-slate-900/30">
              <Upload size={32} className="mb-2 opacity-50" />
              <p className="font-mono text-sm uppercase">No visual data detected.</p>
            </div>
          ) : (
            photos.map((photo) => (
              <div key={photo.id} className="relative aspect-square group bg-slate-900 border border-slate-800 hover:border-blue-500 transition-colors cursor-pointer">
                <img src={photo.url} alt="pool item" className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                <button
                  onClick={() => onRemovePhoto(photo.id)}
                  disabled={disabled}
                  className="absolute inset-0 bg-red-900/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:hidden backdrop-blur-[2px]"
                  title="Purge"
                >
                  <Trash2 className="text-white" size={20} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PhotoPool;