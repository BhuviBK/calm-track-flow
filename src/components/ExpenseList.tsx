
import React from 'react';
import { format } from 'date-fns';
import { useAppContext } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const ExpenseList: React.FC = () => {
  const { expenses, deleteExpense } = useAppContext();
  
  // Sort expenses by date (newest first)
  const sortedExpenses = [...expenses].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  const handleDelete = (id: string) => {
    deleteExpense(id);
    toast.success('Expense deleted');
  };
  
  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  return (
    <Card className="shadow-md">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl">Recent Expenses</CardTitle>
        <div className="text-xl font-semibold text-right">
          Total: ${totalAmount.toFixed(2)}
        </div>
      </CardHeader>
      <CardContent>
        {expenses.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
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
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedExpenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell>{format(new Date(expense.date), 'MMM d, yyyy')}</TableCell>
                    <TableCell>{expense.category}</TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {expense.description || '-'}
                    </TableCell>
                    <TableCell className="text-right">${expense.amount.toFixed(2)}</TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDelete(expense.id)}
                        className="h-8 w-8 p-0"
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
  );
};

export default ExpenseList;
