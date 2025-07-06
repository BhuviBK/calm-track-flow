
import React, { useState } from 'react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Trash2, Download, Edit } from 'lucide-react';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '@/lib/utils';
import * as XLSX from 'xlsx';

const expenseSchema = z.object({
  amount: z.coerce.number().positive('Amount must be positive'),
  category: z.string().min(1, 'Category is required'),
  description: z.string().optional(),
  date: z.date({
    required_error: 'Date is required',
  })
});

const expenseCategories = ['Food', 'Transportation', 'Housing', 'Entertainment', 'Shopping', 'Utilities', 'Healthcare', 'Education', 'Other'];

interface ExpenseData {
  id: string;
  date: Date;
  amount: number;
  category: string;
  description: string;
}

const ExpenseList: React.FC = () => {
  const { expenses, deleteExpense, updateExpense } = useAppContext();
  const isMobile = useIsMobile();
  const [editingExpense, setEditingExpense] = useState<ExpenseData | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  // Sort expenses by date (newest first)
  const sortedExpenses = [...expenses].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  const form = useForm<z.infer<typeof expenseSchema>>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      amount: 0,
      category: '',
      description: '',
      date: new Date()
    }
  });

  const handleEdit = (expense: ExpenseData) => {
    setEditingExpense(expense);
    form.reset({
      amount: expense.amount,
      category: expense.category,
      description: expense.description,
      date: new Date(expense.date)
    });
    setIsEditDialogOpen(true);
  };

  const handleEditSubmit = (values: z.infer<typeof expenseSchema>) => {
    if (!editingExpense) return;

    const updatedExpense = {
      ...editingExpense,
      amount: Number(values.amount),
      category: values.category,
      description: values.description || '',
      date: values.date
    };
    updateExpense(updatedExpense);
    
    setIsEditDialogOpen(false);
    setEditingExpense(null);
    toast.success('Expense updated successfully');
  };
  
  const handleDelete = (id: string) => {
    deleteExpense(id);
    toast.success('Expense deleted');
  };
  
  const totalAmount = expenses.reduce((sum, expense) => sum + Number(expense.amount), 0);
  
  const exportToExcel = () => {
    if (expenses.length === 0) {
      toast.error('No expenses to export');
      return;
    }

    // Prepare data for Excel export
    const excelData = expenses.map(expense => ({
      Date: format(new Date(expense.date), 'dd/MM/yyyy'),
      Category: expense.category,
      Description: expense.description || '-',
      Amount: Number(expense.amount).toFixed(2)
    }));

    // Add total row
    excelData.push({
      Date: '',
      Category: '',
      Description: 'TOTAL',
      Amount: totalAmount.toFixed(2)
    });

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);

    // Set column widths
    ws['!cols'] = [
      { width: 12 }, // Date
      { width: 15 }, // Category
      { width: 30 }, // Description
      { width: 12 }  // Amount
    ];

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Expenses');

    // Generate filename with current date
    const filename = `expenses_${format(new Date(), 'dd-MM-yyyy')}.xlsx`;

    // Download the file
    XLSX.writeFile(wb, filename);
    
    toast.success('Expenses exported successfully!');
  };
  
  return (
    <Card className="shadow-md transition-all duration-300 hover:shadow-lg">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
        <CardTitle className="text-xl">Recent Expenses</CardTitle>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
          <Button
            onClick={exportToExcel}
            variant="outline"
            size={isMobile ? "icon" : "sm"}
            className="flex items-center gap-2 hover:bg-green-50 hover:border-green-300 transition-colors self-end sm:self-auto"
            title={isMobile ? "Export to Excel" : ""}
          >
            <Download className="h-4 w-4" />
            {!isMobile && "Export to Excel"}
          </Button>
          <div className="text-xl font-semibold text-left sm:text-right w-full sm:w-auto">
            Total: ₹{totalAmount.toFixed(2)}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {expenses.length === 0 ? (
          <div className="text-center py-8 text-gray-500 animate-pulse">
            No expenses recorded yet
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="w-[120px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedExpenses.map((expense, index) => (
                  <TableRow 
                    key={expense.id}
                    className="transition-all duration-300 hover:bg-forest-50 dark:hover:bg-forest-900/20"
                    style={{ 
                      animationDelay: `${index * 50}ms`,
                      animation: 'fade-in 0.5s ease-out forwards'
                    }}
                  >
                    <TableCell>{format(new Date(expense.date), 'MMM d, yyyy')}</TableCell>
                    <TableCell>{expense.category}</TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {expense.description || '-'}
                    </TableCell>
                    <TableCell className="text-right">₹{Number(expense.amount).toFixed(2)}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleEdit(expense)}
                          className="h-8 w-8 p-0 transition-all duration-300 hover:bg-blue-100 hover:text-blue-700"
                        >
                          <Edit className="h-4 w-4 text-blue-500" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDelete(expense.id)}
                          className="h-8 w-8 p-0 transition-all duration-300 hover:bg-red-100 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Expense</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleEditSubmit)} className="space-y-4">
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
              
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-forest-500 hover:bg-forest-600"
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ExpenseList;
