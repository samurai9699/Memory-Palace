export interface MemoryObject {
  id: string;
  type: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  color: string;
  text: string;
  title: string;
  lastReviewed?: Date;
  memoryStrength: number;
}

export interface Room {
  id: string;
  name: string;
  type: 'ancient-library' | 'medieval-castle' | 'modern-office' | 'zen-garden';
  objects: MemoryObject[];
  lighting: {
    ambient: string;
    directional: {
      color: string;
      position: [number, number, number];
      intensity: number;
    };
  };
}

export interface MemoryPalace {
  id: string;
  name: string;
  rooms: Room[];
  currentRoom: string;
  created: Date;
  lastModified: Date;
}

export interface QuizSession {
  id: string;
  palaceId: string;
  objects: string[];
  currentIndex: number;
  score: number;
  startTime: Date;
  endTime?: Date;
  mistakes: number;
}

export interface GameState {
  currentPalace: MemoryPalace | null;
  currentRoom: Room | null;
  selectedObject: MemoryObject | null;
  mode: 'explore' | 'edit' | 'quiz';
  isPlacing: boolean;
  placingObjectType: string | null;
  quizSession: QuizSession | null;
}

export interface ObjectType {
  id: string;
  name: string;
  model: string;
  category: string;
  defaultColor: string;
  description: string;
}