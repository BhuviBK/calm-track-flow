
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MoodData {
  date: Date;
  mood: number;
  note: string;
}

interface MoodChartProps {
  moodData: MoodData[];
}

const MoodChart: React.FC<MoodChartProps> = ({ moodData }) => {
  // Get the last 14 days for the chart
  const last14Days = [...Array(14)].map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (13 - i));
    date.setHours(0, 0, 0, 0);
    return date;
  });
  
  const moodByDay = last14Days.map(day => {
    const dayStr = day.toISOString().split('T')[0];
    const dayMood = moodData.find(mood => {
      const moodDate = new Date(mood.date);
      return moodDate.toISOString().split('T')[0] === dayStr;
    });
    
    return {
      day: day.getDate(),
      month: day.toLocaleDateString('en-US', { month: 'short' }),
      mood: dayMood ? dayMood.mood : null,
      note: dayMood ? dayMood.note : ''
    };
  });
  
  // Calculate average mood if there's data
  const moodValues = moodData.map(d => d.mood);
  const avgMood = moodValues.length
    ? Number((moodValues.reduce((acc, val) => acc + val, 0) / moodValues.length).toFixed(1))
    : 0;
  
  // Get mood emoji
  const getMoodEmoji = (mood: number | null): string => {
    if (mood === null) return '';
    
    switch (mood) {
      case 1: return '😞';
      case 2: return '😔';
      case 3: return '😐';
      case 4: return '🙂';
      case 5: return '😊';
      default: return '';
    }
  };
  
  // Get color for mood
  const getMoodColor = (mood: number | null): string => {
    if (mood === null) return 'bg-gray-200';
    
    switch (mood) {
      case 1: return 'bg-red-400';
      case 2: return 'bg-orange-400';
      case 3: return 'bg-yellow-400';
      case 4: return 'bg-green-300';
      case 5: return 'bg-green-500';
      default: return 'bg-gray-200';
    }
  };
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Mood Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end h-44 gap-1">
            {moodByDay.map((day, i) => (
              <div 
                key={i} 
                className="flex-1 flex flex-col items-center"
                title={day.note || 'No mood recorded'}
              >
                <div className="h-32 flex items-end justify-center w-full">
                  {day.mood !== null && (
                    <div 
                      className={`w-full ${getMoodColor(day.mood)} rounded-t-sm relative`} 
                      style={{ height: `${(day.mood / 5) * 100}%` }}
                    >
                      <div className="absolute -top-7 left-1/2 -translate-x-1/2 text-lg">
                        {getMoodEmoji(day.mood)}
                      </div>
                    </div>
                  )}
                </div>
                <div className="text-xs mt-1 text-center w-full">
                  <div className="font-medium">{day.day}</div>
                  {i === 0 || day.day === 1 ? <div className="text-[10px] text-gray-500">{day.month}</div> : null}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average Mood
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-2xl font-bold mr-2">{avgMood}</div>
              <div className="text-xl">{getMoodEmoji(Math.round(avgMood))}</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Entries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{moodData.length}</div>
          </CardContent>
        </Card>
      </div>
      
      {moodData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-md">Recent Entries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-48 overflow-y-auto pr-2">
              {[...moodData]
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 3)
                .map((entry, i) => (
                  <div key={i} className="flex items-start gap-3 pb-3 border-b last:border-b-0">
                    <div className="text-xl">{getMoodEmoji(entry.mood)}</div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">
                        {new Date(entry.date).toLocaleDateString()}
                      </div>
                      {entry.note && (
                        <div className="text-sm text-gray-500 mt-1">{entry.note}</div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MoodChart;
