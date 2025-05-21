
import React from 'react';
import Layout from '@/components/Layout';
import PomodoroTimer from '@/components/PomodoroTimer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PomodoroPage: React.FC = () => {
  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <h1 className="text-2xl font-bold">Pomodoro Timer</h1>
        <p className="text-muted-foreground">
          Use the Pomodoro Technique to break your work into intervals, traditionally 25 minutes in length, separated by short breaks.
        </p>
        
        <Card className="border-l-4 border-l-forest-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Pomodoro Benefits</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
              <li>Improves focus and concentration</li>
              <li>Reduces mental fatigue</li>
              <li>Increases productivity</li>
              <li>Creates a sense of accomplishment</li>
              <li>Helps manage distractions</li>
            </ul>
          </CardContent>
        </Card>
        
        <PomodoroTimer />
      </div>
    </Layout>
  );
};

export default PomodoroPage;
