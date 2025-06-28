import React, { useEffect, useState } from 'react';
import { Clock, Target, Award, X } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';

interface QuizInterfaceProps {
  isActive: boolean;
  onClose: () => void;
}

export default function QuizInterface({ isActive, onClose }: QuizInterfaceProps) {
  const { 
    quizSession, 
    currentRoom, 
    nextQuizObject, 
    completeQuiz, 
    updateQuizScore,
    selectedObject 
  } = useGameStore();
  
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [showResult, setShowResult] = useState(false);
  
  useEffect(() => {
    if (!isActive || !quizSession) return;
    
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - quizSession.startTime.getTime()) / 1000);
      setTimeElapsed(elapsed);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isActive, quizSession]);
  
  useEffect(() => {
    if (selectedObject && quizSession && currentRoom) {
      const currentObjectId = quizSession.objects[quizSession.currentIndex];
      const isCorrect = selectedObject.id === currentObjectId;
      
      updateQuizScore(isCorrect);
      setShowResult(true);
      
      setTimeout(() => {
        setShowResult(false);
        if (quizSession.currentIndex < quizSession.objects.length - 1) {
          nextQuizObject();
        } else {
          completeQuiz();
        }
      }, 2000);
    }
  }, [selectedObject, quizSession, currentRoom, updateQuizScore, nextQuizObject, completeQuiz]);
  
  if (!isActive || !quizSession || !currentRoom) return null;
  
  const currentObjectId = quizSession.objects[quizSession.currentIndex];
  const currentObject = currentRoom.objects.find(obj => obj.id === currentObjectId);
  const progress = ((quizSession.currentIndex + 1) / quizSession.objects.length) * 100;
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  if (showResult) {
    const isCorrect = selectedObject?.id === currentObjectId;
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className={`p-8 rounded-2xl text-center ${
          isCorrect ? 'bg-green-600' : 'bg-red-600'
        }`}>
          <div className="text-white text-6xl mb-4">
            {isCorrect ? '✓' : '✗'}
          </div>
          <h2 className="text-white text-2xl font-bold">
            {isCorrect ? 'Correct!' : 'Incorrect'}
          </h2>
          {!isCorrect && currentObject && (
            <p className="text-white/80 mt-2">
              You were looking for: {currentObject.title}
            </p>
          )}
        </div>
      </div>
    );
  }
  
  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-4 z-40 min-w-96">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Target size={20} className="text-white" />
          <h3 className="text-white font-semibold">Memory Quiz</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-white/20 rounded-lg text-white transition-colors"
        >
          <X size={16} />
        </button>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between text-white text-sm">
          <div className="flex items-center gap-2">
            <Clock size={16} />
            <span>{formatTime(timeElapsed)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Award size={16} />
            <span>{quizSession.score}/{quizSession.objects.length}</span>
          </div>
        </div>
        
        <div className="bg-white/10 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <div className="text-center">
          <h4 className="text-white text-lg font-semibold mb-2">
            Find the object:
          </h4>
          {currentObject && (
            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <h5 className="text-white font-medium text-xl">{currentObject.title}</h5>
              {currentObject.text && (
                <p className="text-white/70 text-sm mt-2">{currentObject.text}</p>
              )}
            </div>
          )}
        </div>
        
        <div className="text-center text-white/60 text-sm">
          Object {quizSession.currentIndex + 1} of {quizSession.objects.length}
        </div>
      </div>
    </div>
  );
}