
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Timer, Play, Pause, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const PomodoroTimer: React.FC = () => {
  const [mode, setMode] = useState<'work' | 'break'>('work');
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [workDuration, setWorkDuration] = useState(25); // in minutes
  const [breakDuration, setBreakDuration] = useState(5); // in minutes
  const { toast } = useToast();
  
  // Reset timer when mode changes
  useEffect(() => {
    setTimeLeft(mode === 'work' ? workDuration * 60 : breakDuration * 60);
    setIsActive(false);
  }, [mode, workDuration, breakDuration]);

  // Timer countdown logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      // Timer finished
      const nextMode = mode === 'work' ? 'break' : 'work';
      toast({
        title: `${mode === 'work' ? 'Work session' : 'Break'} completed!`,
        description: `Time for ${nextMode === 'work' ? 'work' : 'a break'}!`,
      });
      setMode(nextMode);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, mode, toast]);

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate progress percentage
  const calculateProgress = (): number => {
    const totalSeconds = mode === 'work' ? workDuration * 60 : breakDuration * 60;
    return ((totalSeconds - timeLeft) / totalSeconds) * 100;
  };

  const handleStartPause = () => {
    setIsActive(!isActive);
  };

  const handleReset = () => {
    setTimeLeft(mode === 'work' ? workDuration * 60 : breakDuration * 60);
    setIsActive(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Timer className="h-5 w-5" />
          Pomodoro Timer
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="timer" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="timer">Timer</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="timer" className="space-y-4 py-2">
            <div className="flex justify-center mb-4">
              <div className="flex gap-2">
                <Button 
                  variant={mode === 'work' ? 'default' : 'outline'}
                  onClick={() => setMode('work')}
                  className={mode === 'work' ? 'bg-forest-600' : ''}
                >
                  Work
                </Button>
                <Button 
                  variant={mode === 'break' ? 'default' : 'outline'}
                  onClick={() => setMode('break')}
                  className={mode === 'break' ? 'bg-forest-600' : ''}
                >
                  Break
                </Button>
              </div>
            </div>
            
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="w-32 h-32 rounded-full border-4 border-forest-500 flex items-center justify-center">
                <span className="text-3xl font-bold">{formatTime(timeLeft)}</span>
              </div>
              
              <div className="w-full bg-secondary rounded-full h-2 mb-4">
                <div 
                  className="bg-forest-500 h-2 rounded-full transition-all" 
                  style={{ width: `${calculateProgress()}%` }}
                ></div>
              </div>
              
              <div className="flex gap-2">
                <Button onClick={handleStartPause} className="bg-forest-500 hover:bg-forest-600">
                  {isActive ? <Pause size={20} /> : <Play size={20} />}
                  {isActive ? 'Pause' : 'Start'}
                </Button>
                <Button variant="outline" onClick={handleReset}>
                  <RotateCcw size={20} />
                  Reset
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-4 py-2">
            <div>
              <h4 className="text-sm font-medium mb-2">Work Duration (minutes): {workDuration}</h4>
              <Slider
                min={5}
                max={60}
                step={5}
                value={[workDuration]}
                onValueChange={(value) => setWorkDuration(value[0])}
                className="mb-6"
              />
            </div>
            <div>
              <h4 className="text-sm font-medium mb-2">Break Duration (minutes): {breakDuration}</h4>
              <Slider
                min={1}
                max={20}
                step={1}
                value={[breakDuration]}
                onValueChange={(value) => setBreakDuration(value[0])}
              />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PomodoroTimer;
