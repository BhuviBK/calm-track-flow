
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { v4 as uuidv4 } from 'uuid';
import { useAppContext } from '@/contexts/AppContext';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { toast } from 'sonner';

const foodSchema = z.object({
  name: z.string().min(1, 'Food name is required'),
  calories: z.coerce.number().positive('Calories must be positive'),
  quantity: z.coerce.number().positive('Quantity must be positive'),
  meal: z.enum(['breakfast', 'lunch', 'dinner', 'snack'], {
    required_error: 'Please select a meal',
  }),
});

const FoodTracker: React.FC = () => {
  const { addFoodEntry } = useAppContext();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof foodSchema>>({
    resolver: zodResolver(foodSchema),
    defaultValues: {
      name: '',
      calories: 0,
      quantity: 1,
      meal: undefined,
    }
  });

  const onSubmit = async (values: z.infer<typeof foodSchema>) => {
    setIsSubmitting(true);
    try {
      const foodEntry = {
        id: uuidv4(),
        date: new Date(),
        name: values.name,
        calories: Number(values.calories),
        quantity: Number(values.quantity),
        meal: values.meal,
      };

      addFoodEntry(foodEntry);
      form.reset({
        name: '',
        calories: 0,
        quantity: 1,
        meal: undefined,
      });
      toast.success('Food entry added successfully');
    } catch (error) {
      console.error('Error adding food entry:', error);
      toast.error('Failed to add food entry');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="shadow-md transition-all duration-300 hover:shadow-lg">
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 px-0">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1">
                    Food Name
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Apple, Chicken Breast" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="calories"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1">
                    Calories per serving
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="150" 
                      step="1" 
                      min="0" 
                      {...field}
                      value={field.value === 0 ? '' : field.value}
                      onChange={e => field.onChange(e.target.value === '' ? 0 : Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1">
                    Quantity
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="1" 
                      step="0.1" 
                      min="0.1" 
                      {...field}
                      value={field.value === 0 ? 1 : field.value}
                      onChange={e => field.onChange(e.target.value === '' ? 1 : Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="meal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1">
                    Meal
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a meal" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="breakfast">Breakfast</SelectItem>
                      <SelectItem value="lunch">Lunch</SelectItem>
                      <SelectItem value="dinner">Dinner</SelectItem>
                      <SelectItem value="snack">Snack</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full bg-forest-500 hover:bg-forest-600 transition-all duration-300 transform hover:scale-105" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Adding...' : 'Add Food Entry'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default FoodTracker;
