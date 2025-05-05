
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';

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

  return (
    <div className="meditation-card">
      <h2 className="text-xl font-semibold mb-4">How are you feeling today?</h2>
      
      <div className="mb-6">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(date) => date && setDate(date)}
          className="p-3 pointer-events-auto rounded-md border"
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
          className="w-full bg-calm-500 hover:bg-calm-600 text-white font-medium py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Save Mood
        </button>
      </form>
    </div>
  );
};

export default MoodTracker;
