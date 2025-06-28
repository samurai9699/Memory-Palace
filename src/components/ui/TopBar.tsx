import React, { useState } from 'react';
import { 
  Home, 
  Edit3, 
  Play, 
  Target, 
  Package, 
  Settings, 
  Save, 
  Download,
  Menu,
  X
} from 'lucide-react';
import { useGameStore } from '../../store/gameStore';

interface TopBarProps {
  onToggleObjectPalette: () => void;
  onTogglePropertyPanel: () => void;
  onToggleQuiz: () => void;
  onHome: () => void;
}

export default function TopBar({ 
  onToggleObjectPalette, 
  onTogglePropertyPanel, 
  onToggleQuiz, 
  onHome 
}: TopBarProps) {
  const { mode, setMode, currentPalace, savePalace, exportPalace, startQuiz } = useGameStore();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  const handleExport = () => {
    if (!currentPalace) return;
    
    const data = exportPalace();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentPalace.name}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };
  
  const handleStartQuiz = () => {
    startQuiz();
    onToggleQuiz();
  };

  const menuItems = [
    { icon: Home, label: 'Home', onClick: onHome },
    { icon: Edit3, label: 'Edit', onClick: () => setMode('edit'), active: mode === 'edit' },
    { icon: Play, label: 'Explore', onClick: () => setMode('explore'), active: mode === 'explore' },
    { icon: Target, label: 'Quiz', onClick: handleStartQuiz },
    { icon: Package, label: 'Objects', onClick: onToggleObjectPalette },
    { icon: Settings, label: 'Properties', onClick: onTogglePropertyPanel },
    { icon: Save, label: 'Save', onClick: savePalace },
    { icon: Download, label: 'Export', onClick: handleExport }
  ];

  return (
    <>
      {/* Desktop TopBar */}
      <div className="hidden md:flex fixed top-4 left-1/2 transform -translate-x-1/2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl px-4 py-2 z-40">
        <div className="flex items-center gap-2">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={item.onClick}
              className={`
                flex items-center gap-2 px-3 py-2 rounded-lg text-white transition-colors
                ${item.active ? 'bg-blue-600 text-white' : 'hover:bg-white/20'}
              `}
              title={item.label}
            >
              <item.icon size={16} />
              <span className="hidden lg:inline">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setShowMobileMenu(!showMobileMenu)}
        className="md:hidden fixed top-4 right-4 p-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl text-white z-50"
      >
        {showMobileMenu ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="md:hidden fixed top-16 right-4 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-2 z-40">
          <div className="flex flex-col gap-1">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  item.onClick();
                  setShowMobileMenu(false);
                }}
                className={`
                  flex items-center gap-3 px-3 py-2 rounded-lg text-white transition-colors text-left
                  ${item.active ? 'bg-blue-600 text-white' : 'hover:bg-white/20'}
                `}
              >
                <item.icon size={16} />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Mobile backdrop */}
      {showMobileMenu && (
        <div 
          className="md:hidden fixed inset-0 bg-black/20 z-30"
          onClick={() => setShowMobileMenu(false)}
        />
      )}
    </>
  );
}