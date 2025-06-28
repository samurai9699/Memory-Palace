import { create } from 'zustand';
import { GameState, MemoryPalace, Room, MemoryObject, QuizSession } from '../types';
import { roomTemplates } from '../data/objectTypes';

interface GameStore extends GameState {
  // Palace management
  createPalace: (name: string, roomType: string) => void;
  loadPalace: (palace: MemoryPalace) => void;
  savePalace: () => void;
  deletePalace: (id: string) => void;
  
  // Room management
  switchRoom: (roomId: string) => void;
  
  // Object management
  addObject: (objectType: string, position: [number, number, number]) => void;
  updateObject: (id: string, updates: Partial<MemoryObject>) => void;
  deleteObject: (id: string) => void;
  selectObject: (id: string | null) => void;
  
  // Mode management
  setMode: (mode: 'explore' | 'edit' | 'quiz') => void;
  setPlacing: (isPlacing: boolean, objectType?: string) => void;
  
  // Quiz management
  startQuiz: () => void;
  nextQuizObject: () => void;
  completeQuiz: () => void;
  updateQuizScore: (correct: boolean) => void;
  
  // Data management
  exportPalace: () => string;
  importPalace: (data: string) => boolean;
}

const createDefaultRoom = (type: string): Room => {
  const template = roomTemplates.find(t => t.id === type) || roomTemplates[0];
  return {
    id: `room-${Date.now()}`,
    name: template.name,
    type: type as any,
    objects: [],
    lighting: template.environment.lighting
  };
};

export const useGameStore = create<GameStore>((set, get) => ({
  currentPalace: null,
  currentRoom: null,
  selectedObject: null,
  mode: 'explore',
  isPlacing: false,
  placingObjectType: null,
  quizSession: null,

  createPalace: (name: string, roomType: string) => {
    const room = createDefaultRoom(roomType);
    const palace: MemoryPalace = {
      id: `palace-${Date.now()}`,
      name,
      rooms: [room],
      currentRoom: room.id,
      created: new Date(),
      lastModified: new Date()
    };
    
    set({
      currentPalace: palace,
      currentRoom: room,
      mode: 'edit'
    });
    
    // Save to localStorage
    const saved = JSON.parse(localStorage.getItem('memoryPalaces') || '[]');
    saved.push(palace);
    localStorage.setItem('memoryPalaces', JSON.stringify(saved));
  },

  loadPalace: (palace: MemoryPalace) => {
    const currentRoom = palace.rooms.find(r => r.id === palace.currentRoom) || palace.rooms[0];
    set({
      currentPalace: palace,
      currentRoom,
      selectedObject: null,
      mode: 'explore'
    });
  },

  savePalace: () => {
    const { currentPalace } = get();
    if (!currentPalace) return;
    
    currentPalace.lastModified = new Date();
    const saved = JSON.parse(localStorage.getItem('memoryPalaces') || '[]');
    const index = saved.findIndex((p: MemoryPalace) => p.id === currentPalace.id);
    
    if (index >= 0) {
      saved[index] = currentPalace;
    } else {
      saved.push(currentPalace);
    }
    
    localStorage.setItem('memoryPalaces', JSON.stringify(saved));
  },

  deletePalace: (id: string) => {
    const saved = JSON.parse(localStorage.getItem('memoryPalaces') || '[]');
    const filtered = saved.filter((p: MemoryPalace) => p.id !== id);
    localStorage.setItem('memoryPalaces', JSON.stringify(filtered));
  },

  switchRoom: (roomId: string) => {
    const { currentPalace } = get();
    if (!currentPalace) return;
    
    const room = currentPalace.rooms.find(r => r.id === roomId);
    if (room) {
      set({ currentRoom: room, selectedObject: null });
      currentPalace.currentRoom = roomId;
    }
  },

  addObject: (objectType: string, position: [number, number, number]) => {
    const { currentRoom, currentPalace } = get();
    if (!currentRoom || !currentPalace) return;
    
    const newObject: MemoryObject = {
      id: `obj-${Date.now()}`,
      type: objectType,
      position,
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      color: '#FFFFFF',
      text: '',
      title: `New ${objectType}`,
      memoryStrength: 0
    };
    
    currentRoom.objects.push(newObject);
    set({ 
      currentRoom: { ...currentRoom },
      selectedObject: newObject,
      isPlacing: false,
      placingObjectType: null
    });
  },

  updateObject: (id: string, updates: Partial<MemoryObject>) => {
    const { currentRoom } = get();
    if (!currentRoom) return;
    
    const objectIndex = currentRoom.objects.findIndex(obj => obj.id === id);
    if (objectIndex >= 0) {
      currentRoom.objects[objectIndex] = { ...currentRoom.objects[objectIndex], ...updates };
      set({ 
        currentRoom: { ...currentRoom },
        selectedObject: currentRoom.objects[objectIndex]
      });
    }
  },

  deleteObject: (id: string) => {
    const { currentRoom } = get();
    if (!currentRoom) return;
    
    currentRoom.objects = currentRoom.objects.filter(obj => obj.id !== id);
    set({ 
      currentRoom: { ...currentRoom },
      selectedObject: null
    });
  },

  selectObject: (id: string | null) => {
    const { currentRoom } = get();
    if (!currentRoom) return;
    
    const object = id ? currentRoom.objects.find(obj => obj.id === id) : null;
    set({ selectedObject: object });
  },

  setMode: (mode: 'explore' | 'edit' | 'quiz') => {
    set({ mode, selectedObject: null, isPlacing: false, placingObjectType: null });
  },

  setPlacing: (isPlacing: boolean, objectType?: string) => {
    set({ isPlacing, placingObjectType: objectType || null });
  },

  startQuiz: () => {
    const { currentRoom, currentPalace } = get();
    if (!currentRoom || !currentPalace || currentRoom.objects.length === 0) return;
    
    const shuffledObjects = [...currentRoom.objects].sort(() => Math.random() - 0.5);
    const quizSession: QuizSession = {
      id: `quiz-${Date.now()}`,
      palaceId: currentPalace.id,
      objects: shuffledObjects.map(obj => obj.id),
      currentIndex: 0,
      score: 0,
      startTime: new Date(),
      mistakes: 0
    };
    
    set({ 
      mode: 'quiz',
      quizSession,
      selectedObject: null
    });
  },

  nextQuizObject: () => {
    const { quizSession } = get();
    if (!quizSession) return;
    
    if (quizSession.currentIndex < quizSession.objects.length - 1) {
      quizSession.currentIndex++;
      set({ quizSession: { ...quizSession } });
    } else {
      get().completeQuiz();
    }
  },

  completeQuiz: () => {
    const { quizSession } = get();
    if (!quizSession) return;
    
    quizSession.endTime = new Date();
    
    // Save quiz results
    const results = JSON.parse(localStorage.getItem('quizResults') || '[]');
    results.push(quizSession);
    localStorage.setItem('quizResults', JSON.stringify(results));
    
    set({ 
      mode: 'explore',
      quizSession: null
    });
  },

  updateQuizScore: (correct: boolean) => {
    const { quizSession } = get();
    if (!quizSession) return;
    
    if (correct) {
      quizSession.score++;
    } else {
      quizSession.mistakes++;
    }
    
    set({ quizSession: { ...quizSession } });
  },

  exportPalace: () => {
    const { currentPalace } = get();
    if (!currentPalace) return '';
    
    return JSON.stringify(currentPalace, null, 2);
  },

  importPalace: (data: string) => {
    try {
      const palace: MemoryPalace = JSON.parse(data);
      palace.id = `palace-${Date.now()}`;
      palace.lastModified = new Date();
      
      get().loadPalace(palace);
      get().savePalace();
      return true;
    } catch (error) {
      console.error('Failed to import palace:', error);
      return false;
    }
  }
}));