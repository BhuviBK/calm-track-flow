
import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface MoodData {
  date: Date;
  mood: number;
  note: string;
}

interface MoodChartProps {
  moodData: MoodData[];
}

const MoodChart: React.FC<MoodChartProps> = ({ moodData }) => {
  const [visibleRange, setVisibleRange] = useState<{ start: number, end: number }>({
    start: 0,
    end: 5
  });
  
  const sortedData = [...moodData].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  const chartData = sortedData.map(entry => ({
    date: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    mood: entry.mood,
    timestamp: new Date(entry.date).getTime(),
    note: entry.note
  }));
  
  const visibleData = chartData.slice(visibleRange.start, visibleRange.end);
  
  const showNext = () => {
    if (visibleRange.end < chartData.length) {
      setVisibleRange({
        start: visibleRange.start + 1,
        end: visibleRange.end + 1
      });
    }
  };
  
  const showPrevious = () => {
    if (visibleRange.start > 0) {
      setVisibleRange({
        start: visibleRange.start - 1,
        end: visibleRange.end - 1
      });
    }
  };
  
  useEffect(() => {
    // Reset to show the 5 most recent entries when mood data changes
    if (chartData.length > 0) {
      const end = chartData.length;
      const start = Math.max(0, end - 5);
      setVisibleRange({ start, end });
    }
  }, [moodData.length]);
  
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded shadow-lg border">
          <p className="font-medium">{data.date}</p>
          <p>Mood: {getMoodEmoji(data.mood)}</p>
          {data.note && <p className="text-sm mt-1">{data.note}</p>}
        </div>
      );
    }
    return null;
  };
  
  const getMoodEmoji = (value: number) => {
    const emojis = ['😞', '😔', '😐', '🙂', '😊'];
    return emojis[value - 1] || '';
  };
  
  return (
    <Card className="p-4">
      {moodData.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No mood data recorded yet</p>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={showPrevious}
              disabled={visibleRange.start <= 0}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium">
              Showing {visibleRange.start + 1} - {Math.min(visibleRange.end, chartData.length)} of {chartData.length}
            </span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={showNext}
              disabled={visibleRange.end >= chartData.length}
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={visibleData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4a85d3" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#4a85d3" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis 
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  tickMargin={5}
                />
                <YAxis 
                  domain={[0, 5]}
                  ticks={[1, 2, 3, 4, 5]}
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => getMoodEmoji(value)}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone"
                  dataKey="mood"
                  stroke="#4a85d3"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorMood)"
                  activeDot={{ r: 6 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </Card>
  );
};

export default MoodChart;
