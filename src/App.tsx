import React, { useState } from 'react';
import MainMenu from './components/ui/MainMenu';
import Scene3D from './components/Scene3D';
import TopBar from './components/ui/TopBar';
import ObjectPalette from './components/ui/ObjectPalette';
import PropertyPanel from './components/ui/PropertyPanel';
import QuizInterface from './components/ui/QuizInterface';
import MiniMap from './components/ui/MiniMap';
import { useGameStore } from './store/gameStore';

function App() {
  const [showMenu, setShowMenu] = useState(true);
  const [showObjectPalette, setShowObjectPalette] = useState(false);
  const [showPropertyPanel, setShowPropertyPanel] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  
  const { currentPalace, mode } = useGameStore();

  const handleStart = () => {
    setShowMenu(false);
  };

  const handleHome = () => {
    setShowMenu(true);
    setShowObjectPalette(false);
    setShowPropertyPanel(false);
    setShowQuiz(false);
  };

  const handleToggleQuiz = () => {
    setShowQuiz(!showQuiz);
  };

  if (showMenu) {
    return <MainMenu onStart={handleStart} />;
  }

  if (!currentPalace) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No Palace Loaded</h2>
          <button
            onClick={handleHome}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            Return to Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-gray-900 overflow-hidden">
      <Scene3D />
      
      <TopBar
        onToggleObjectPalette={() => setShowObjectPalette(!showObjectPalette)}
        onTogglePropertyPanel={() => setShowPropertyPanel(!showPropertyPanel)}
        onToggleQuiz={handleToggleQuiz}
        onHome={handleHome}
      />
      
      <ObjectPalette
        isOpen={showObjectPalette}
        onClose={() => setShowObjectPalette(false)}
      />
      
      <PropertyPanel
        isOpen={showPropertyPanel}
        onClose={() => setShowPropertyPanel(false)}
      />
      
      <QuizInterface
        isActive={showQuiz || mode === 'quiz'}
        onClose={() => setShowQuiz(false)}
      />
      
      <MiniMap isVisible={mode !== 'quiz'} />
      
      {/* Instructions overlay */}
      {mode === 'explore' && (
        <div className="fixed bottom-4 left-4 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg p-3 text-white text-sm max-w-xs">
          <p className="font-medium mb-1">First-Person Mode</p>
          <p className="text-white/70">Click to lock cursor, then use WASD to move and mouse to look around</p>
        </div>
      )}
      
      {mode === 'edit' && (
        <div className="fixed bottom-4 left-4 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg p-3 text-white text-sm max-w-xs">
          <p className="font-medium mb-1">Edit Mode</p>
          <p className="text-white/70">Use the Object Palette to add items, then click objects to edit their properties</p>
        </div>
      )}
    </div>
  );
}

export default App;