
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { useAppContext } from '@/contexts/AppContext';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const expenseSchema = z.object({
  amount: z.coerce.number().positive('Amount must be positive'),
  category: z.string().min(1, 'Category is required'),
  description: z.string().optional(),
  date: z.date({
    required_error: 'Date is required',
  })
});

const expenseCategories = ['Food', 'Transportation', 'Housing', 'Entertainment', 'Shopping', 'Utilities', 'Healthcare', 'Education', 'Other'];

const ExpenseTracker: React.FC = () => {
  const { addExpense } = useAppContext();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof expenseSchema>>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      amount: 0,
      category: '',
      description: '',
      date: new Date()
    }
  });

  const onSubmit = async (values: z.infer<typeof expenseSchema>) => {
    setIsSubmitting(true);
    try {
      const expense = {
        id: uuidv4(),
        date: values.date,
        amount: Number(values.amount),
        category: values.category,
        description: values.description || ''
      };

      addExpense(expense);
      form.reset({
        amount: 0,
        category: '',
        description: '',
        date: new Date()
      });
      toast.success('Expense added successfully');
    } catch (error) {
      console.error('Error adding expense:', error);
      toast.error('Failed to add expense');
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
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="flex items-center gap-1">
                    Date
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date > new Date()}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1">
                    Amount
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                      <Input
                        type="number"
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        className="pl-8"
                        {...field}
                        value={field.value === 0 ? '' : field.value}
                        onChange={e => field.onChange(e.target.value === '' ? 0 : Number(e.target.value))}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1">
                    Category
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {expenseCategories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="What did you spend on?" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button
              type="submit"
              className="w-full bg-forest-500 hover:bg-forest-600 transition-all duration-300 transform hover:scale-105"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Adding...' : 'Add Expense'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ExpenseTracker;
