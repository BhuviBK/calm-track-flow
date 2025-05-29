
import React from 'react';
import { format } from 'date-fns';
import { useAppContext } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Trash2, Download } from 'lucide-react';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';

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
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl">Recent Expenses</CardTitle>
        <div className="flex items-center gap-4">
          <Button
            onClick={exportToExcel}
            variant="outline"
            size="sm"
            className="flex items-center gap-2 hover:bg-green-50 hover:border-green-300 transition-colors"
          >
            <Download className="h-4 w-4" />
            Export to Excel
          </Button>
          <div className="text-xl font-semibold text-right">
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
                  <TableHead className="w-[80px]"></TableHead>
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
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDelete(expense.id)}
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
  );
};

export default ExpenseList;
