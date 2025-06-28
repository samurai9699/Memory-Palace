import React, { useState, useEffect } from 'react';
import { Brain, Plus, Play, BarChart3, Download, Upload, Trash2 } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { MemoryPalace } from '../../types';
import { roomTemplates } from '../../data/objectTypes';

interface MainMenuProps {
  onStart: () => void;
}

export default function MainMenu({ onStart }: MainMenuProps) {
  const [view, setView] = useState<'main' | 'create' | 'load' | 'stats'>('main');
  const [palaceName, setPalaceName] = useState('');
  const [selectedRoom, setSelectedRoom] = useState(roomTemplates[0].id);
  const [savedPalaces, setSavedPalaces] = useState<MemoryPalace[]>([]);
  const { createPalace, loadPalace, deletePalace, importPalace } = useGameStore();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('memoryPalaces') || '[]');
    setSavedPalaces(saved);
  }, [view]);

  const handleCreatePalace = () => {
    if (palaceName.trim()) {
      createPalace(palaceName, selectedRoom);
      onStart();
    }
  };

  const handleLoadPalace = (palace: MemoryPalace) => {
    loadPalace(palace);
    onStart();
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target?.result as string;
        if (importPalace(data)) {
          alert('Memory palace imported successfully!');
          const saved = JSON.parse(localStorage.getItem('memoryPalaces') || '[]');
          setSavedPalaces(saved);
        } else {
          alert('Failed to import memory palace. Please check the file format.');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleDeletePalace = (id: string) => {
    if (confirm('Are you sure you want to delete this memory palace?')) {
      deletePalace(id);
      const saved = JSON.parse(localStorage.getItem('memoryPalaces') || '[]');
      setSavedPalaces(saved);
    }
  };

  if (view === 'create') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-6">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md w-full border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-6">Create Memory Palace</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Palace Name
              </label>
              <input
                type="text"
                value={palaceName}
                onChange={(e) => setPalaceName(e.target.value)}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter palace name..."
              />
            </div>
            
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Room Template
              </label>
              <select
                value={selectedRoom}
                onChange={(e) => setSelectedRoom(e.target.value)}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                {roomTemplates.map((template) => (
                  <option key={template.id} value={template.id} className="bg-gray-800">
                    {template.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="text-sm text-white/60">
              {roomTemplates.find(t => t.id === selectedRoom)?.description}
            </div>
          </div>
          
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setView('main')}
              className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleCreatePalace}
              disabled={!palaceName.trim()}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:opacity-50 rounded-lg text-white transition-colors"
            >
              Create
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'load') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-6">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-2xl w-full border border-white/20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Load Memory Palace</h2>
            <div className="flex gap-2">
              <label className="px-3 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white cursor-pointer transition-colors">
                <Upload size={16} className="inline mr-2" />
                Import
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                />
              </label>
            </div>
          </div>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {savedPalaces.length === 0 ? (
              <div className="text-center text-white/60 py-8">
                <Brain size={48} className="mx-auto mb-4 opacity-50" />
                <p>No saved memory palaces found</p>
                <p className="text-sm">Create your first palace to get started</p>
              </div>
            ) : (
              savedPalaces.map((palace) => (
                <div
                  key={palace.id}
                  className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <div>
                    <h3 className="text-white font-medium">{palace.name}</h3>
                    <p className="text-white/60 text-sm">
                      {palace.rooms.length} room{palace.rooms.length !== 1 ? 's' : ''} • 
                      Last modified: {new Date(palace.lastModified).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleLoadPalace(palace)}
                      className="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors"
                    >
                      Load
                    </button>
                    <button
                      onClick={() => handleDeletePalace(palace.id)}
                      className="px-3 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <button
            onClick={() => setView('main')}
            className="w-full mt-6 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-colors"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-6">
      <div className="text-center">
        <div className="mb-8">
          <Brain size={80} className="mx-auto text-white mb-4" />
          <h1 className="text-5xl font-bold text-white mb-2">Memory Palace</h1>
          <p className="text-xl text-white/80">Master the art of spatial memory</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
          <button
            onClick={() => setView('create')}
            className="group p-6 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
          >
            <Plus size={32} className="mx-auto text-white mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-semibold text-white mb-2">Create Palace</h3>
            <p className="text-white/70 text-sm">Build your first 3D memory space</p>
          </button>
          
          <button
            onClick={() => setView('load')}
            className="group p-6 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
          >
            <Play size={32} className="mx-auto text-white mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-semibold text-white mb-2">Load Palace</h3>
            <p className="text-white/70 text-sm">Continue your memory journey</p>
          </button>
          
          <button
            onClick={() => setView('stats')}
            className="group p-6 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
          >
            <BarChart3 size={32} className="mx-auto text-white mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-semibold text-white mb-2">Statistics</h3>
            <p className="text-white/70 text-sm">Track your progress</p>
          </button>
          
          <button
            onClick={() => alert('Tutorial coming soon!')}
            className="group p-6 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
          >
            <Brain size={32} className="mx-auto text-white mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-semibold text-white mb-2">Tutorial</h3>
            <p className="text-white/70 text-sm">Learn the memory method</p>
          </button>
        </div>
        
        <div className="mt-8 text-white/60 text-sm">
          <p>Use the ancient Method of Loci to remember anything</p>
          <p>Navigate with WASD keys and mouse in 3D space</p>
        </div>
      </div>
    </div>
  );
}