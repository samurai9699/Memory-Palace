import React, { useState } from 'react';
import { Settings, Trash2, X } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';

interface PropertyPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PropertyPanel({ isOpen, onClose }: PropertyPanelProps) {
  const { selectedObject, updateObject, deleteObject } = useGameStore();
  const [localTitle, setLocalTitle] = useState(selectedObject?.title || '');
  const [localText, setLocalText] = useState(selectedObject?.text || '');
  const [localColor, setLocalColor] = useState(selectedObject?.color || '#FFFFFF');
  
  React.useEffect(() => {
    if (selectedObject) {
      setLocalTitle(selectedObject.title);
      setLocalText(selectedObject.text);
      setLocalColor(selectedObject.color);
    }
  }, [selectedObject]);

  if (!isOpen || !selectedObject) return null;

  const handleSave = () => {
    updateObject(selectedObject.id, {
      title: localTitle,
      text: localText,
      color: localColor
    });
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this object?')) {
      deleteObject(selectedObject.id);
      onClose();
    }
  };

  return (
    <div className="fixed right-4 top-1/2 transform -translate-y-1/2 w-80 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-4 z-50">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Settings size={20} className="text-white" />
          <h3 className="text-white font-semibold">Object Properties</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-white/20 rounded-lg text-white transition-colors"
        >
          <X size={16} />
        </button>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-white/80 text-sm font-medium mb-2">
            Title
          </label>
          <input
            type="text"
            value={localTitle}
            onChange={(e) => setLocalTitle(e.target.value)}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Object title..."
          />
        </div>
        
        <div>
          <label className="block text-white/80 text-sm font-medium mb-2">
            Memory Note
          </label>
          <textarea
            value={localText}
            onChange={(e) => setLocalText(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
            placeholder="What do you want to remember here?"
          />
        </div>
        
        <div>
          <label className="block text-white/80 text-sm font-medium mb-2">
            Color
          </label>
          <div className="flex gap-2">
            <input
              type="color"
              value={localColor}
              onChange={(e) => setLocalColor(e.target.value)}
              className="w-12 h-10 bg-transparent border border-white/20 rounded cursor-pointer"
            />
            <input
              type="text"
              value={localColor}
              onChange={(e) => setLocalColor(e.target.value)}
              className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-2 pt-2">
          <div>
            <label className="block text-white/80 text-xs mb-1">Scale</label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={selectedObject.scale[0]}
              onChange={(e) => {
                const scale = parseFloat(e.target.value);
                updateObject(selectedObject.id, { scale: [scale, scale, scale] });
              }}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-white/80 text-xs mb-1">Memory Strength</label>
            <div className="text-white text-sm">{selectedObject.memoryStrength}/5</div>
          </div>
        </div>
      </div>
      
      <div className="flex gap-2 mt-6">
        <button
          onClick={handleSave}
          className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors"
        >
          Save
        </button>
        <button
          onClick={handleDelete}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white transition-colors"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}