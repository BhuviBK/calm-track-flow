
import React, { useState } from 'react';
import { format, isToday } from 'date-fns';
import { useAppContext } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface FoodListProps {
  startDate?: Date;
  endDate?: Date;
  periodLabel?: string;
}

const FoodList: React.FC<FoodListProps> = ({ startDate, endDate, periodLabel }) => {
  const { foodEntries, deleteFoodEntry } = useAppContext();
  
  // Filter food entries based on date range
  const filteredFoodEntries = startDate && endDate 
    ? foodEntries.filter(food => {
        const foodDate = new Date(food.date);
        return foodDate >= startDate && foodDate <= endDate;
      })
    : foodEntries;

  // Sort filtered food entries by date (newest first)
  const sortedFoodEntries = [...filteredFoodEntries].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Calculate calories for the filtered period
  const periodCalories = filteredFoodEntries.reduce((sum, food) => sum + (food.calories * food.quantity), 0);

  // Calculate today's calories (always show today's summary)
  const todayFoodEntries = foodEntries.filter(food => isToday(new Date(food.date)));
  const todayCalories = todayFoodEntries.reduce((sum, food) => sum + (food.calories * food.quantity), 0);

  // Group today's entries by meal
  const mealGroups = {
    breakfast: todayFoodEntries.filter(food => food.meal === 'breakfast'),
    lunch: todayFoodEntries.filter(food => food.meal === 'lunch'),
    dinner: todayFoodEntries.filter(food => food.meal === 'dinner'),
    snack: todayFoodEntries.filter(food => food.meal === 'snack'),
  };

  const getMealCalories = (meal: keyof typeof mealGroups) => {
    return mealGroups[meal].reduce((sum, food) => sum + (food.calories * food.quantity), 0);
  };

  const handleDelete = (id: string) => {
    deleteFoodEntry(id);
    toast.success('Food entry deleted');
  };

  const totalCalories = foodEntries.reduce((sum, food) => sum + (food.calories * food.quantity), 0);

  return (
    <div className="space-y-6">
      {/* Today's Summary - Always show */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-xl">Today's Calories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-4">
            <div className="text-3xl font-bold text-forest-600">{todayCalories}</div>
            <div className="text-gray-600">calories consumed today</div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-orange-50 p-3 rounded-lg">
              <div className="text-lg font-semibold text-orange-600">{getMealCalories('breakfast')}</div>
              <div className="text-sm text-gray-600">Breakfast</div>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="text-lg font-semibold text-green-600">{getMealCalories('lunch')}</div>
              <div className="text-sm text-gray-600">Lunch</div>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="text-lg font-semibold text-blue-600">{getMealCalories('dinner')}</div>
              <div className="text-sm text-gray-600">Dinner</div>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <div className="text-lg font-semibold text-purple-600">{getMealCalories('snack')}</div>
              <div className="text-sm text-gray-600">Snacks</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filtered Food Entries */}
      <Card className="shadow-md transition-all duration-300 hover:shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl">
            {periodLabel ? `${periodLabel} Food History` : 'Food History'}
          </CardTitle>
          <div className="text-xl font-semibold">
            {periodLabel ? `${periodLabel}: ${periodCalories} calories` : `Total: ${totalCalories} calories`}
          </div>
        </CardHeader>
        <CardContent>
          {sortedFoodEntries.length === 0 ? (
            <div className="text-center py-8 text-gray-500 animate-pulse">
              {periodLabel ? `No food entries for ${periodLabel.toLowerCase()}` : 'No food entries recorded yet'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Food</TableHead>
                    <TableHead>Meal</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead className="text-right">Calories</TableHead>
                    <TableHead className="w-[80px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedFoodEntries.map((food, index) => (
                    <TableRow 
                      key={food.id}
                      className="transition-all duration-300 hover:bg-forest-50 dark:hover:bg-forest-900/20"
                      style={{ 
                        animationDelay: `${index * 50}ms`,
                        animation: 'fade-in 0.5s ease-out forwards'
                      }}
                    >
                      <TableCell>{format(new Date(food.date), 'MMM d, yyyy')}</TableCell>
                      <TableCell className="font-medium">{food.name}</TableCell>
                      <TableCell>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          food.meal === 'breakfast' ? 'bg-orange-100 text-orange-800' :
                          food.meal === 'lunch' ? 'bg-green-100 text-green-800' :
                          food.meal === 'dinner' ? 'bg-blue-100 text-blue-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {food.meal.charAt(0).toUpperCase() + food.meal.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell>{food.quantity}</TableCell>
                      <TableCell className="text-right font-medium">
                        {Math.round(food.calories * food.quantity)} cal
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDelete(food.id)}
                          className="h-8 w-8 p-0 transition-all duration-300 hover:bg-red-100 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FoodList;
