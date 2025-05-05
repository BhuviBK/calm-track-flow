
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const BreathingExercise: React.FC = () => {
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale' | 'rest'>('rest');
  const [count, setCount] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [cycles, setCycles] = useState<number>(0);

  // Timing for each phase in seconds
  const timing = {
    inhale: 4,
    hold: 4,
    exhale: 6,
    rest: 2,
  };
  
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive) {
      interval = setInterval(() => {
        setCount((prevCount) => {
          const nextCount = prevCount + 1;
          
          // Phase transitions
          switch (phase) {
            case 'inhale':
              if (nextCount >= timing.inhale) {
                setPhase('hold');
                return 0;
              }
              break;
            case 'hold':
              if (nextCount >= timing.hold) {
                setPhase('exhale');
                return 0;
              }
              break;
            case 'exhale':
              if (nextCount >= timing.exhale) {
                setPhase('rest');
                return 0;
              }
              break;
            case 'rest':
              if (nextCount >= timing.rest) {
                setPhase('inhale');
                setCycles(c => c + 1);
                return 0;
              }
              break;
          }
          
          return nextCount;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, phase]);
  
  const toggleActive = () => {
    if (!isActive) {
      setPhase('inhale');
      setCount(0);
      setCycles(0);
    }
    setIsActive(!isActive);
  };

  const getCircleSize = () => {
    switch (phase) {
      case 'inhale':
        return `${50 + (count / timing.inhale) * 50}%`;
      case 'hold':
        return '100%';
      case 'exhale':
        return `${100 - (count / timing.exhale) * 50}%`;
      case 'rest':
        return '50%';
      default:
        return '50%';
    }
  };

  return (
    <Card className="w-full bg-white/90 backdrop-blur-sm border border-purple-100 shadow-lg">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center">
          <h3 className="text-xl font-semibold mb-2">Breathing Exercise</h3>
          <p className="text-sm text-gray-500 mb-6">
            4-4-6 Breathing (Box Breathing)
          </p>
          
          <div className="relative w-48 h-48 mb-6 flex items-center justify-center">
            <div 
              className={cn(
                "absolute rounded-full bg-opacity-20 transition-all duration-1000",
                phase === 'inhale' ? 'bg-calm-300' :
                phase === 'hold' ? 'bg-purple-300' :
                phase === 'exhale' ? 'bg-calm-200' : 'bg-gray-200'
              )}
              style={{
                width: getCircleSize(),
                height: getCircleSize(),
              }}
            ></div>
            <div className="z-10 text-lg font-medium">
              {phase === 'rest' && !isActive ? 'Begin' : phase.charAt(0).toUpperCase() + phase.slice(1)}
            </div>
          </div>
          
          <div className="text-center mb-6">
            <p className="text-xl font-semibold mb-1">
              {isActive ? phase.charAt(0).toUpperCase() + phase.slice(1) : 'Ready?'}
            </p>
            {isActive && (
              <>
                <p className="text-4xl font-bold text-calm-600">
                  {phase === 'inhale' ? timing.inhale - count : 
                   phase === 'hold' ? timing.hold - count : 
                   phase === 'exhale' ? timing.exhale - count :
                   timing.rest - count}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Completed cycles: {cycles}
                </p>
              </>
            )}
          </div>
          
          <Button 
            onClick={toggleActive}
            className={isActive ? "bg-red-500 hover:bg-red-600" : "bg-calm-500 hover:bg-calm-600"}
          >
            {isActive ? 'Stop' : 'Start Breathing'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BreathingExercise;
