import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Flame, Calendar, Trophy } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { format, subDays, isToday, parseISO } from 'date-fns';

interface CalorieStreakProps {
  totalCaloriesToday: number;
}

const CalorieStreak: React.FC<CalorieStreakProps> = ({ totalCaloriesToday }) => {
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user && totalCaloriesToday > 0) {
      calculateStreak();
    }
  }, [user, totalCaloriesToday]);

  const calculateStreak = async () => {
    try {
      // Get all food entries for the user, ordered by date
      const { data: entries, error } = await supabase
        .from('food_entries')
        .select('date, calories')
        .eq('user_id', user?.id)
        .order('date', { ascending: false });

      if (error) throw error;

      if (!entries || entries.length === 0) {
        setCurrentStreak(totalCaloriesToday > 0 ? 1 : 0);
        setLongestStreak(totalCaloriesToday > 0 ? 1 : 0);
        setLoading(false);
        return;
      }

      // Group calories by date
      const caloriesByDate: Record<string, number> = {};
      entries.forEach(entry => {
        const date = entry.date;
        if (!caloriesByDate[date]) {
          caloriesByDate[date] = 0;
        }
        caloriesByDate[date] += entry.calories;
      });

      // Calculate current streak
      let streak = 0;
      let checkDate = new Date();
      
      // Include today if we have calories
      if (totalCaloriesToday > 0) {
        streak = 1;
        checkDate = subDays(checkDate, 1);
      }

      // Check previous days
      while (true) {
        const dateStr = format(checkDate, 'yyyy-MM-dd');
        if (caloriesByDate[dateStr] && caloriesByDate[dateStr] > 0) {
          streak++;
          checkDate = subDays(checkDate, 1);
        } else {
          break;
        }
      }

      // Calculate longest streak
      let maxStreak = 0;
      let tempStreak = 0;
      const allDates = Object.keys(caloriesByDate).sort();
      
      // Include today in the calculation if we have calories
      const today = format(new Date(), 'yyyy-MM-dd');
      if (totalCaloriesToday > 0 && !allDates.includes(today)) {
        allDates.push(today);
        allDates.sort();
      }

      let previousDate: Date | null = null;
      
      for (const dateStr of allDates) {
        const currentDate = parseISO(dateStr);
        const hasCalories = dateStr === today ? totalCaloriesToday > 0 : (caloriesByDate[dateStr] && caloriesByDate[dateStr] > 0);
        
        if (hasCalories) {
          if (previousDate === null || 
              Math.abs(currentDate.getTime() - previousDate.getTime()) === 24 * 60 * 60 * 1000) {
            tempStreak++;
          } else {
            tempStreak = 1;
          }
          maxStreak = Math.max(maxStreak, tempStreak);
          previousDate = currentDate;
        } else {
          tempStreak = 0;
          previousDate = null;
        }
      }

      maxStreak = Math.max(maxStreak, streak);

      setCurrentStreak(streak);
      setLongestStreak(maxStreak);
    } catch (error) {
      console.error('Error calculating streak:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="shadow-md">
        <CardContent className="pt-6">
          <div className="text-center">Loading streak...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-md transition-all duration-300 hover:shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Flame className="h-5 w-5 text-orange-500" />
          Calorie Tracking Streak
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-2">
              <Flame className="h-6 w-6 text-orange-500" />
              <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {currentStreak}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">Current Streak</p>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-2">
              <Trophy className="h-6 w-6 text-yellow-500" />
              <span className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {longestStreak}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">Best Streak</p>
          </div>
        </div>

        <div className="pt-4 border-t">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Today's Calories:</span>
            <Badge variant={totalCaloriesToday > 0 ? "default" : "secondary"}>
              {totalCaloriesToday} cal
            </Badge>
          </div>
          
          {currentStreak > 0 && (
            <div className="mt-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-sm text-green-700 dark:text-green-300 text-center">
                🎉 Great job! You've been tracking for {currentStreak} day{currentStreak !== 1 ? 's' : ''}!
              </p>
            </div>
          )}
          
          {totalCaloriesToday === 0 && (
            <div className="mt-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <p className="text-sm text-yellow-700 dark:text-yellow-300 text-center">
                Add some food entries today to continue your streak!
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CalorieStreak;