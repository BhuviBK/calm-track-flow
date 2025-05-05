
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';

const MeditationTimer: React.FC = () => {
  const [duration, setDuration] = useState<number>(5);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [completed, setCompleted] = useState<boolean>(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && !isPaused && timeLeft !== null && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => (prev !== null && prev > 0 ? prev - 1 : 0));
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      setCompleted(true);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, isPaused, timeLeft]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = () => {
    setTimeLeft(duration * 60);
    setIsActive(true);
    setCompleted(false);
  };

  const pauseTimer = () => {
    setIsPaused(!isPaused);
  };

  const resetTimer = () => {
    setIsActive(false);
    setIsPaused(false);
    setTimeLeft(null);
    setCompleted(false);
  };

  const progress = timeLeft !== null ? ((duration * 60 - timeLeft) / (duration * 60)) * 100 : 0;

  return (
    <Card className="w-full bg-white/90 backdrop-blur-sm border border-calm-100 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-center">Meditation Timer</CardTitle>
      </CardHeader>
      
      <CardContent>
        {!isActive && timeLeft === null ? (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Duration: {duration} minutes
              </label>
              <Slider
                value={[duration]}
                min={1}
                max={60}
                step={1}
                onValueChange={(value) => setDuration(value[0])}
                className="my-4"
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="relative w-48 h-48 mb-6">
              <div className="absolute inset-0 rounded-full bg-gray-100"></div>
              <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray="283"
                  strokeDashoffset={283 - (283 * progress) / 100}
                  className="text-calm-500 transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl font-bold">
                  {timeLeft !== null ? formatTime(timeLeft) : formatTime(duration * 60)}
                </span>
              </div>
            </div>
            
            {completed && (
              <div className="mb-4 text-center">
                <p className="text-lg font-semibold text-calm-700">
                  Meditation Complete
                </p>
                <p className="text-sm text-gray-500">
                  Great job! You've completed your session.
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-center space-x-2">
        {!isActive && timeLeft === null ? (
          <Button onClick={startTimer} className="bg-calm-500 hover:bg-calm-600">
            Start Meditation
          </Button>
        ) : (
          <>
            <Button
              onClick={pauseTimer}
              variant="outline"
              disabled={completed}
            >
              {isPaused ? 'Resume' : 'Pause'}
            </Button>
            <Button
              onClick={resetTimer}
              variant="outline"
            >
              Reset
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default MeditationTimer;
