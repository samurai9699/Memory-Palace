import { ObjectType } from '../types';

export const objectTypes: ObjectType[] = [
  // Books & Scrolls
  { id: 'book', name: 'Book', model: 'book', category: 'knowledge', defaultColor: '#8B4513', description: 'Ancient tome of wisdom' },
  { id: 'scroll', name: 'Scroll', model: 'scroll', category: 'knowledge', defaultColor: '#F4E4BC', description: 'Parchment scroll' },
  { id: 'journal', name: 'Journal', model: 'journal', category: 'knowledge', defaultColor: '#654321', description: 'Personal diary' },
  
  // Treasures
  { id: 'gem', name: 'Gem', model: 'gem', category: 'treasure', defaultColor: '#FF4500', description: 'Precious gemstone' },
  { id: 'coin', name: 'Golden Coin', model: 'coin', category: 'treasure', defaultColor: '#FFD700', description: 'Ancient gold coin' },
  { id: 'crown', name: 'Crown', model: 'crown', category: 'treasure', defaultColor: '#FFD700', description: 'Royal crown' },
  { id: 'chest', name: 'Treasure Chest', model: 'chest', category: 'treasure', defaultColor: '#8B4513', description: 'Ornate treasure chest' },
  
  // Weapons & Armor
  { id: 'sword', name: 'Sword', model: 'sword', category: 'weapon', defaultColor: '#C0C0C0', description: 'Knight\'s blade' },
  { id: 'shield', name: 'Shield', model: 'shield', category: 'weapon', defaultColor: '#8B4513', description: 'Protective shield' },
  { id: 'mask', name: 'Mask', model: 'mask', category: 'artifact', defaultColor: '#DAA520', description: 'Ceremonial mask' },
  
  // Nature & Plants
  { id: 'plant', name: 'Plant', model: 'plant', category: 'nature', defaultColor: '#228B22', description: 'Leafy plant' },
  { id: 'flower', name: 'Flower', model: 'flower', category: 'nature', defaultColor: '#FF69B4', description: 'Beautiful flower' },
  { id: 'crystal', name: 'Crystal', model: 'crystal', category: 'nature', defaultColor: '#9370DB', description: 'Magical crystal' },
  
  // Tools & Instruments
  { id: 'candle', name: 'Candle', model: 'candle', category: 'tool', defaultColor: '#FFFACD', description: 'Flickering candle' },
  { id: 'key', name: 'Key', model: 'key', category: 'tool', defaultColor: '#FFD700', description: 'Ornate key' },
  { id: 'hourglass', name: 'Hourglass', model: 'hourglass', category: 'tool', defaultColor: '#D2691E', description: 'Time keeper' },
  { id: 'telescope', name: 'Telescope', model: 'telescope', category: 'tool', defaultColor: '#8B4513', description: 'Stargazing instrument' },
  
  // Art & Culture
  { id: 'painting', name: 'Painting', model: 'painting', category: 'art', defaultColor: '#8B4513', description: 'Framed artwork' },
  { id: 'statue', name: 'Statue', model: 'statue', category: 'art', defaultColor: '#A9A9A9', description: 'Stone sculpture' },
  { id: 'pottery', name: 'Pottery', model: 'pottery', category: 'art', defaultColor: '#CD853F', description: 'Clay vessel' },
  { id: 'instrument', name: 'Lute', model: 'lute', category: 'art', defaultColor: '#8B4513', description: 'Musical instrument' }
];

export const roomTemplates = [
  {
    id: 'ancient-library',
    name: 'Ancient Library',
    description: 'Stone walls lined with ancient tomes and scrolls',
    environment: {
      walls: '#696969',
      floor: '#F5F5DC',
      ceiling: '#2F4F4F',
      lighting: {
        ambient: '#404040',
        directional: {
          color: '#FFA500',
          position: [5, 10, 5] as [number, number, number],
          intensity: 0.8
        }
      }
    }
  },
  {
    id: 'medieval-castle',
    name: 'Medieval Castle',
    description: 'Grand throne room with stone walls and colorful banners',
    environment: {
      walls: '#696969',
      floor: '#2F4F4F',
      ceiling: '#1C1C1C',
      lighting: {
        ambient: '#2F2F2F',
        directional: {
          color: '#FF4500',
          position: [0, 15, 0] as [number, number, number],
          intensity: 1.0
        }
      }
    }
  },
  {
    id: 'modern-office',
    name: 'Modern Office',
    description: 'Sleek contemporary workspace with glass and steel',
    environment: {
      walls: '#F8F8FF',
      floor: '#DCDCDC',
      ceiling: '#FFFFFF',
      lighting: {
        ambient: '#F0F0F0',
        directional: {
          color: '#FFFFFF',
          position: [0, 10, 5] as [number, number, number],
          intensity: 1.2
        }
      }
    }
  },
  {
    id: 'zen-garden',
    name: 'Zen Garden',
    description: 'Peaceful Japanese garden with bamboo and flowing water',
    environment: {
      walls: '#DEB887',
      floor: '#F5DEB3',
      ceiling: '#87CEEB',
      lighting: {
        ambient: '#E6E6FA',
        directional: {
          color: '#FFFACD',
          position: [10, 15, 10] as [number, number, number],
          intensity: 0.9
        }
      }
    }
  }
];