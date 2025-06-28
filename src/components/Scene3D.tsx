import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PointerLockControls, Box, Sphere, Text } from '@react-three/drei';
import { useGameStore } from '../store/gameStore';
import { MemoryObject } from '../types';
import { objectTypes } from '../data/objectTypes';
import * as THREE from 'three';

interface MemoryObjectMeshProps {
  object: MemoryObject;
  isSelected: boolean;
  onSelect: () => void;
}

function MemoryObjectMesh({ object, isSelected, onSelect }: MemoryObjectMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    if (meshRef.current) {
      // Gentle floating animation
      meshRef.current.position.y = object.position[1] + Math.sin(state.clock.elapsedTime + object.position[0]) * 0.1;
      
      // Glow effect when selected or hovered
      if (isSelected || hovered) {
        meshRef.current.scale.setScalar(1.1);
      } else {
        meshRef.current.scale.setScalar(1);
      }
    }
  });

  const objectType = objectTypes.find(type => type.id === object.type);
  const color = isSelected ? '#FFD700' : hovered ? '#FFA500' : object.color;

  return (
    <group position={object.position} rotation={object.rotation}>
      <mesh
        ref={meshRef}
        onClick={onSelect}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        {object.type === 'book' && <Box args={[0.3, 0.4, 0.05]} />}
        {object.type === 'gem' && <Sphere args={[0.15]} />}
        {object.type === 'scroll' && <Box args={[0.1, 0.4, 0.1]} />}
        {object.type === 'candle' && <Box args={[0.05, 0.3, 0.05]} />}
        {object.type === 'sword' && <Box args={[0.05, 0.8, 0.05]} />}
        {object.type === 'shield' && <Box args={[0.4, 0.5, 0.05]} />}
        {object.type === 'plant' && <Sphere args={[0.2]} />}
        {object.type === 'crystal' && <Box args={[0.2, 0.3, 0.2]} />}
        {/* Default shape for unspecified objects */}
        {!['book', 'gem', 'scroll', 'candle', 'sword', 'shield', 'plant', 'crystal'].includes(object.type) && 
         <Box args={[0.2, 0.2, 0.2]} />}
        
        <meshStandardMaterial 
          color={color}
          emissive={isSelected || hovered ? '#333333' : '#000000'}
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>
      
      {(isSelected || hovered) && object.title && (
        <Text
          position={[0, 0.5, 0]}
          fontSize={0.1}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {object.title}
        </Text>
      )}
    </group>
  );
}

function Room() {
  const { currentRoom } = useGameStore();
  
  if (!currentRoom) return null;

  const lighting = currentRoom.lighting;
  
  return (
    <>
      {/* Ambient light */}
      <ambientLight color={lighting.ambient} intensity={0.4} />
      
      {/* Directional light */}
      <directionalLight
        color={lighting.directional.color}
        position={lighting.directional.position}
        intensity={lighting.directional.intensity}
        castShadow
      />
      
      {/* Room geometry */}
      <group>
        {/* Floor */}
        <mesh position={[0, -2, 0]} receiveShadow>
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial color="#8B7D6B" />
        </mesh>
        
        {/* Walls */}
        <mesh position={[0, 3, -10]} receiveShadow>
          <planeGeometry args={[20, 10]} />
          <meshStandardMaterial color="#696969" />
        </mesh>
        
        <mesh position={[-10, 3, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
          <planeGeometry args={[20, 10]} />
          <meshStandardMaterial color="#696969" />
        </mesh>
        
        <mesh position={[10, 3, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
          <planeGeometry args={[20, 10]} />
          <meshStandardMaterial color="#696969" />
        </mesh>
        
        {/* Ceiling */}
        <mesh position={[0, 8, 0]} rotation={[Math.PI, 0, 0]} receiveShadow>
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial color="#2F4F4F" />
        </mesh>
      </group>
    </>
  );
}

function CameraController() {
  const { camera } = useThree();
  const { mode } = useGameStore();
  
  useEffect(() => {
    if (mode === 'quiz' || mode === 'explore') {
      camera.position.set(0, 1.7, 5); // Eye level height
    }
  }, [camera, mode]);
  
  return null;
}

function ObjectPlacer() {
  const { isPlacing, placingObjectType, addObject, setPlacing } = useGameStore();
  const { camera, raycaster, mouse, scene } = useThree();
  
  useEffect(() => {
    if (!isPlacing) return;
    
    const handleClick = (event: MouseEvent) => {
      const rect = (event.target as HTMLCanvasElement).getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      
      raycaster.setFromCamera(mouse, camera);
      
      // Find intersection with floor
      const floorPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 2);
      const intersection = new THREE.Vector3();
      raycaster.ray.intersectPlane(floorPlane, intersection);
      
      if (intersection && placingObjectType) {
        addObject(placingObjectType, [intersection.x, intersection.y + 0.5, intersection.z]);
      }
    };
    
    const canvas = document.querySelector('canvas');
    if (canvas) {
      canvas.addEventListener('click', handleClick);
      return () => canvas.removeEventListener('click', handleClick);
    }
  }, [isPlacing, placingObjectType, addObject, camera, raycaster, mouse]);
  
  return null;
}

export default function Scene3D() {
  const { currentRoom, selectedObject, selectObject, mode } = useGameStore();
  
  if (!currentRoom) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No Room Selected</h2>
          <p>Create a new memory palace to get started</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="w-full h-full">
      <Canvas
        shadows
        camera={{ position: [0, 1.7, 5], fov: 75 }}
        gl={{ antialias: true, alpha: false }}
      >
        <CameraController />
        <Room />
        <ObjectPlacer />
        
        {/* Render memory objects */}
        {currentRoom.objects.map((object) => (
          <MemoryObjectMesh
            key={object.id}
            object={object}
            isSelected={selectedObject?.id === object.id}
            onSelect={() => selectObject(object.id)}
          />
        ))}
        
        {/* Controls based on mode */}
        {mode === 'explore' || mode === 'quiz' ? (
          <PointerLockControls makeDefault />
        ) : (
          <OrbitControls makeDefault enablePan={true} enableZoom={true} enableRotate={true} />
        )}
      </Canvas>
    </div>
  );
}