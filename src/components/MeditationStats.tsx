
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MeditationData {
  date: Date;
  duration: number;
}

interface MeditationStatsProps {
  sessions: MeditationData[];
}

const MeditationStats: React.FC<MeditationStatsProps> = ({ sessions }) => {
  const totalMinutes = sessions.reduce((acc, session) => acc + session.duration, 0);
  const currentStreak = calculateStreak(sessions);
  const totalSessions = sessions.length;
  const averageDuration = totalSessions > 0 ? Math.round(totalMinutes / totalSessions) : 0;
  
  // Get sessions from the last 7 days for the bar chart
  const last7Days = [...Array(7)].map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);
    return date;
  }).reverse();
  
  const dailyMinutes = last7Days.map(day => {
    const dayStr = day.toISOString().split('T')[0];
    const dayTotal = sessions
      .filter(session => {
        const sessionDate = new Date(session.date);
        return sessionDate.toISOString().split('T')[0] === dayStr;
      })
      .reduce((acc, session) => acc + session.duration, 0);
    
    return {
      day: day.toLocaleDateString('en-US', { weekday: 'short' }),
      minutes: dayTotal
    };
  });
  
  // Calculate the max value for the chart
  const maxMinutes = Math.max(...dailyMinutes.map(d => d.minutes), 10);
  
  function calculateStreak(sessions: MeditationData[]): number {
    if (sessions.length === 0) return 0;
    
    // Sort sessions by date (newest first)
    const sortedSessions = [...sessions].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    // Check if there's a session today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const latestSessionDate = new Date(sortedSessions[0].date);
    latestSessionDate.setHours(0, 0, 0, 0);
    
    // If the latest session is not from today, no streak
    if (latestSessionDate.getTime() !== today.getTime()) {
      return 0;
    }
    
    let streak = 1;
    let currentDate = today;
    
    // Check consecutive days
    for (let i = 1; i < sortedSessions.length; i++) {
      const prevDate = new Date(currentDate);
      prevDate.setDate(prevDate.getDate() - 1);
      prevDate.setHours(0, 0, 0, 0);
      
      const sessionDate = new Date(sortedSessions[i].date);
      sessionDate.setHours(0, 0, 0, 0);
      
      if (sessionDate.getTime() === prevDate.getTime()) {
        streak++;
        currentDate = prevDate;
      } else {
        break;
      }
    }
    
    return streak;
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card>
          <CardHeader className="p-4">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Minutes
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold">{totalMinutes}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="p-4">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Current Streak
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold">{currentStreak} days</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="p-4">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Sessions
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold">{totalSessions}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="p-4">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg. Duration
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold">{averageDuration} min</div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-md">Last 7 Days</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-36 flex items-end gap-2">
            {dailyMinutes.map((data, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div className="w-full bg-gray-100 rounded-t-sm relative" 
                     style={{ 
                       height: `${(data.minutes / maxMinutes) * 100}%`,
                       minHeight: data.minutes > 0 ? '10%' : '0%'
                     }}>
                  <div 
                    className={`absolute inset-0 ${data.minutes > 0 ? 'bg-calm-400' : ''} rounded-t-sm`}
                  ></div>
                </div>
                <div className="text-xs mt-1">{data.day}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MeditationStats;
