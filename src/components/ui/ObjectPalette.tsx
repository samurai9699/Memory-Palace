import React from 'react';
import { Package, X } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { objectTypes } from '../../data/objectTypes';

interface ObjectPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ObjectPalette({ isOpen, onClose }: ObjectPaletteProps) {
  const { setPlacing, isPlacing, placingObjectType } = useGameStore();
  
  if (!isOpen) return null;

  const categories = Array.from(new Set(objectTypes.map(obj => obj.category)));

  const handleObjectSelect = (objectType: string) => {
    setPlacing(true, objectType);
    onClose();
  };

  return (
    <div className="fixed left-4 top-1/2 transform -translate-y-1/2 w-80 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-4 z-50">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Package size={20} className="text-white" />
          <h3 className="text-white font-semibold">Object Palette</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-white/20 rounded-lg text-white transition-colors"
        >
          <X size={16} />
        </button>
      </div>
      
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {categories.map((category) => (
          <div key={category} className="space-y-2">
            <h4 className="text-white/80 text-sm font-medium capitalize">{category}</h4>
            <div className="grid grid-cols-3 gap-2">
              {objectTypes
                .filter(obj => obj.category === category)
                .map((objectType) => (
                  <button
                    key={objectType.id}
                    onClick={() => handleObjectSelect(objectType.id)}
                    className={`
                      p-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/20 transition-colors
                      ${isPlacing && placingObjectType === objectType.id ? 'bg-blue-600/50 border-blue-400' : ''}
                    `}
                    title={objectType.description}
                  >
                    <div 
                      className="w-8 h-8 mx-auto mb-1 rounded"
                      style={{ backgroundColor: objectType.defaultColor }}
                    />
                    <div className="text-white text-xs text-center">{objectType.name}</div>
                  </button>
                ))
              }
            </div>
          </div>
        ))}
      </div>
      
      {isPlacing && (
        <div className="mt-4 p-3 bg-blue-600/20 border border-blue-400/50 rounded-lg">
          <p className="text-white text-sm text-center">
            Click in the 3D space to place your object
          </p>
          <button
            onClick={() => setPlacing(false)}
            className="w-full mt-2 px-3 py-1 bg-white/20 rounded text-white text-sm hover:bg-white/30 transition-colors"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}