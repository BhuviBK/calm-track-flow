
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ExerciseTimer from '@/components/ExerciseTimer';

const ExercisePage: React.FC = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Exercise Tracker</h1>
        <p className="text-muted-foreground">
          Track your workouts and stay consistent with your exercise routine.
        </p>
        
        <Card>
          <CardHeader>
            <CardTitle>Workout Timer</CardTitle>
          </CardHeader>
          <CardContent>
            <ExerciseTimer />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Benefits of Regular Exercise</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
              <li>Improves mental health and mood</li>
              <li>Increases energy levels throughout the day</li>
              <li>Helps maintain a healthy weight</li>
              <li>Reduces risk of chronic diseases</li>
              <li>Promotes better sleep quality</li>
              <li>Enhances cognitive function</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ExercisePage;
