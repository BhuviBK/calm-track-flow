
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface MoodData {
  date: Date;
  mood: number;
  note: string;
}

interface MoodTrackerProps {
  onMoodSubmit: (moodData: MoodData) => void;
}

const MoodTracker: React.FC<MoodTrackerProps> = ({ onMoodSubmit }) => {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [note, setNote] = useState('');
  const [date, setDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  const moods = [
    { value: 1, emoji: '😞', label: 'Very Bad' },
    { value: 2, emoji: '😔', label: 'Bad' },
    { value: 3, emoji: '😐', label: 'Neutral' },
    { value: 4, emoji: '🙂', label: 'Good' },
    { value: 5, emoji: '😊', label: 'Very Good' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedMood !== null) {
      onMoodSubmit({
        date,
        mood: selectedMood,
        note,
      });
      setNote('');
      setSelectedMood(null);
    }
  };

  const nextMonth = () => {
    const next = new Date(currentMonth);
    next.setMonth(next.getMonth() + 1);
    setCurrentMonth(next);
  };

  const prevMonth = () => {
    const prev = new Date(currentMonth);
    prev.setMonth(prev.getMonth() - 1);
    setCurrentMonth(prev);
  };

  const previousDay = () => {
    const prev = new Date(date);
    prev.setDate(date.getDate() - 1);
    setDate(prev);
  };
  
  const nextDay = () => {
    const next = new Date(date);
    next.setDate(date.getDate() + 1);
    setDate(next);
  };

  return (
    <div className="meditation-card">
      <h2 className="text-xl font-semibold mb-4">How are you feeling today?</h2>
      
      <div className="mb-6 w-full max-w-sm mx-auto">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" onClick={previousDay} title="Previous day">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={nextDay} title="Next day">
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="font-medium">
            {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" onClick={prevMonth} title="Previous month">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={nextMonth} title="Next month">
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <Calendar
          mode="single"
          selected={date}
          onSelect={(date) => date && setDate(date)}
          className="p-2 pointer-events-auto rounded-md border w-full max-w-72 mx-auto"
          month={currentMonth}
          onMonthChange={setCurrentMonth}
          numberOfMonths={1}
          showOutsideDays={false}
        />
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="flex justify-between mb-6">
          {moods.map((mood) => (
            <button
              key={mood.value}
              type="button"
              onClick={() => setSelectedMood(mood.value)}
              className={cn(
                'mood-item',
                selectedMood === mood.value ? 'active' : ''
              )}
              title={mood.label}
            >
              <span className="text-2xl">{mood.emoji}</span>
            </button>
          ))}
        </div>
        
        <div className="mb-4">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full p-3 border rounded-lg resize-none"
            placeholder="Add notes about your mood (optional)"
            rows={3}
          />
        </div>
        
        <button
          type="submit"
          disabled={selectedMood === null}
          className="w-full bg-forest-500 hover:bg-forest-600 text-white font-medium py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Save Mood
        </button>
      </form>
    </div>
  );
};

export default MoodTracker;
