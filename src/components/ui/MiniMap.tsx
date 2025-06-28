import React from 'react';
import { Map } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';

interface MiniMapProps {
  isVisible: boolean;
}

export default function MiniMap({ isVisible }: MiniMapProps) {
  const { currentRoom } = useGameStore();
  
  if (!isVisible || !currentRoom) return null;
  
  return (
    <div className="fixed bottom-4 right-4 w-48 h-48 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-3 z-30">
      <div className="flex items-center gap-2 mb-2">
        <Map size={16} className="text-white" />
        <h4 className="text-white text-sm font-medium">Mini Map</h4>
      </div>
      
      <div className="relative w-full h-32 bg-black/20 rounded-lg overflow-hidden">
        {/* Room boundaries */}
        <div className="absolute inset-2 border border-white/30 rounded" />
        
        {/* Objects */}
        {currentRoom.objects.map((object) => {
          const x = ((object.position[0] + 10) / 20) * 100;
          const z = ((object.position[2] + 10) / 20) * 100;
          
          return (
            <div
              key={object.id}
              className="absolute w-2 h-2 bg-blue-400 rounded-full transform -translate-x-1 -translate-y-1"
              style={{
                left: `${Math.max(0, Math.min(100, x))}%`,
                top: `${Math.max(0, Math.min(100, z))}%`
              }}
              title={object.title}
            />
          );
        })}
        
        {/* Player position (center) */}
        <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-green-400 rounded-full transform -translate-x-1/2 -translate-y-1/2" />
      </div>
      
      <div className="text-white/60 text-xs mt-2 text-center">
        {currentRoom.objects.length} objects placed
      </div>
    </div>
  );
}