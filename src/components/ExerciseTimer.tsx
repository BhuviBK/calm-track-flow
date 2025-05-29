
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Pause, SkipForward, RotateCcw, X, Volume2, VolumeX } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import Confetti from 'react-confetti';
import { playBellSound, toggleAmbientMusic, stopAllSounds, preloadAudio } from '@/utils/audioUtils';

interface Exercise {
  id: number;
  name: string;
  completed: boolean;
}

const ExerciseTimer: React.FC = () => {
  const [exercises, setExercises] = useState<Exercise[]>(() => {
    const savedExercises = localStorage.getItem('exercises');
    return savedExercises ? JSON.parse(savedExercises) : [
      { id: 1, name: 'Push-ups', completed: false },
      { id: 2, name: 'Squats', completed: false },
      { id: 3, name: 'Planks', completed: false },
      { id: 4, name: 'Jumping Jacks', completed: false }
    ];
  });
  
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [newExercise, setNewExercise] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [seconds, setSeconds] = useState(60); // 60 seconds per exercise
  const [currentSet, setCurrentSet] = useState(1);
  const [isRest, setIsRest] = useState(false);
  const [restSeconds, setRestSeconds] = useState(10); // 10 seconds rest
  const [showConfetti, setShowConfetti] = useState(false);
  const [musicEnabled, setMusicEnabled] = useState(false);
  const { toast } = useToast();
  
  const totalSets = 3;

  // Initialize audio on component mount
  useEffect(() => {
    preloadAudio();
    console.log("Exercise timer component mounted, audio preloaded");
    
    return () => {
      console.log("Exercise timer component unmounting");
      stopAllSounds();
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('exercises', JSON.stringify(exercises));
  }, [exercises]);

  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  useEffect(() => {
    let interval: number | undefined;
    
    if (isActive) {
      interval = window.setInterval(() => {
        if (isRest) {
          if (restSeconds > 0) {
            setRestSeconds(restSeconds - 1);
          } else {
            // Rest completed, go back to exercise
            setIsRest(false);
            setSeconds(60);
            
            // Play bell sound when rest ends
            playBellSound();
            
            if (currentSet < totalSets) {
              setCurrentSet(currentSet + 1);
              toast({
                title: `Starting set ${currentSet + 1}`,
                description: `${exercises[currentExerciseIndex]?.name || 'Exercise'}`
              });
            } else {
              // All sets completed for this exercise
              setShowConfetti(true);
              const newExercises = [...exercises];
              newExercises[currentExerciseIndex].completed = true;
              setExercises(newExercises);
              
              // Move to next exercise
              if (currentExerciseIndex < exercises.length - 1) {
                setCurrentExerciseIndex(currentExerciseIndex + 1);
                setCurrentSet(1);
                toast({
                  title: "Exercise completed!",
                  description: `Moving to ${exercises[currentExerciseIndex + 1]?.name || 'next exercise'}`
                });
              } else {
                // All exercises completed
                playBellSound();
                toast({
                  title: "Workout completed!",
                  description: "Great job! You've completed all exercises."
                });
                resetTimer();
              }
            }
          }
        } else {
          if (seconds > 0) {
            setSeconds(seconds - 1);
          } else {
            // Exercise set completed, start rest period
            setIsRest(true);
            setRestSeconds(10);
            setShowConfetti(true);
            
            // Play bell sound when exercise set ends
            playBellSound();
            
            toast({
              title: "Rest time!",
              description: "Take 10 seconds to recover"
            });
          }
        }
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isActive, seconds, restSeconds, isRest, currentSet, currentExerciseIndex, exercises, toast]);

  const toggleTimer = () => {
    setIsActive(!isActive);
    
    // Start ambient music when timer starts
    if (!isActive && musicEnabled) {
      toggleAmbientMusic(true);
      console.log("Starting ambient music with timer");
    }
  };

  const toggleMusic = () => {
    const newMusicState = !musicEnabled;
    setMusicEnabled(newMusicState);
    toggleAmbientMusic(newMusicState && isActive);
    console.log("Music toggled:", newMusicState);
    
    toast({
      title: newMusicState ? "Music enabled" : "Music disabled",
      description: newMusicState ? "Background music will play during workouts" : "Background music turned off"
    });
  };

  const resetTimer = () => {
    setIsActive(false);
    setSeconds(60);
    setRestSeconds(10);
    setCurrentSet(1);
    setIsRest(false);
    setCurrentExerciseIndex(0);
    
    // Stop all sounds when resetting
    stopAllSounds();
    
    // Reset completed status
    setExercises(exercises.map(ex => ({ ...ex, completed: false })));
  };

  const skipExercise = () => {
    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
      setCurrentSet(1);
      setSeconds(60);
      setRestSeconds(10);
      setIsRest(false);
    } else {
      toast({
        title: "Last exercise",
        description: "You're already on the last exercise"
      });
    }
  };

  const addExercise = () => {
    if (newExercise.trim() !== '') {
      const newExerciseItem = {
        id: Date.now(),
        name: newExercise,
        completed: false
      };
      setExercises([...exercises, newExerciseItem]);
      setNewExercise('');
    }
  };

  const removeExercise = (id: number) => {
    setExercises(exercises.filter(ex => ex.id !== id));
  };

  const calculateProgress = () => {
    return isRest 
      ? ((10 - restSeconds) / 10) * 100 
      : ((60 - seconds) / 60) * 100;
  };

  return (
    <Card className="w-full">
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={200}
          gravity={0.2}
        />
      )}
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold">
            {isRest ? "Rest Period" : `${exercises[currentExerciseIndex]?.name || 'Exercise'}`}
          </CardTitle>
          <Button
            onClick={toggleMusic}
            variant="outline"
            size="sm"
            className={`${musicEnabled ? 'bg-green-50 border-green-300' : ''}`}
          >
            {musicEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-4xl font-bold mb-2">
            {isRest ? restSeconds : seconds}s
          </div>
          <div className="text-sm text-muted-foreground mb-4">
            {isRest 
              ? `Recovering...` 
              : `Set ${currentSet} of ${totalSets}`}
          </div>
          <Progress value={calculateProgress()} className="h-2 mb-6" />
        </div>
        
        <div className="flex justify-center space-x-4">
          <Button 
            onClick={toggleTimer}
            size="lg"
            variant="default"
            className="bg-forest-600 hover:bg-forest-700 w-24"
          >
            {isActive ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            <span className="ml-2">{isActive ? 'Pause' : 'Start'}</span>
          </Button>
          
          <Button 
            onClick={resetTimer} 
            size="lg"
            variant="outline"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          
          <Button
            onClick={skipExercise}
            size="lg"
            variant="outline"
            disabled={currentExerciseIndex >= exercises.length - 1}
          >
            <SkipForward className="h-4 w-4 mr-2" />
            Skip
          </Button>
        </div>
      </CardContent>
      
      <CardFooter className="flex-col space-y-4">
        <div className="text-sm font-medium">Exercise List</div>
        <ScrollArea className="h-[150px] w-full rounded-md border">
          <div className="p-4 space-y-2">
            {exercises.map((exercise, index) => (
              <div 
                key={exercise.id} 
                className={`flex items-center justify-between p-2 rounded ${
                  currentExerciseIndex === index ? 'bg-forest-100 dark:bg-forest-900' : ''
                } ${
                  exercise.completed ? 'text-muted-foreground' : ''
                }`}
              >
                <div className="flex items-center">
                  <span className="w-6 h-6 flex items-center justify-center rounded-full border mr-2">
                    {index + 1}
                  </span>
                  <span className={exercise.completed ? 'line-through' : ''}>
                    {exercise.name}
                  </span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => removeExercise(exercise.id)}
                  className="opacity-70 hover:opacity-100 h-7 w-7 p-0"
                  disabled={isActive}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
        
        <div className="flex w-full items-center space-x-2">
          <input
            type="text"
            value={newExercise}
            onChange={(e) => setNewExercise(e.target.value)}
            placeholder="Add a new exercise"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            onKeyPress={(e) => e.key === 'Enter' && addExercise()}
          />
          <Button onClick={addExercise} className="bg-forest-500 hover:bg-forest-600">
            Add
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ExerciseTimer;
