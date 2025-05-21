
import React from 'react';
import Layout from '@/components/Layout';
import ExerciseTimer from '@/components/ExerciseTimer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ExerciseTimerPage: React.FC = () => {
  return (
    <Layout>
      <div className="space-y-6 pb-20 md:pb-0 animate-fade-in">
        <h1 className="text-2xl font-bold">Exercise Timer</h1>
        <p className="text-muted-foreground">
          Keep track of your workouts and stay consistent with your exercise routine.
        </p>
        
        <Card>
          <CardHeader>
            <CardTitle>Workout Timer</CardTitle>
          </CardHeader>
          <CardContent>
            <ExerciseTimer />
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ExerciseTimerPage;
