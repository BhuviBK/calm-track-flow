import React, { useState, useEffect, useCallback } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Wallet, Plus, Trash2, Edit2, Check, X, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface Expense {
  id: string;
  description: string;
  amount: number;
  date: string;
}

const BudgetPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [totalBudget, setTotalBudget] = useState<number>(0);
  const [budgetInput, setBudgetInput] = useState<string>('');
  const [isEditingBudget, setIsEditingBudget] = useState<boolean>(false);
  const [isSavingBudget, setIsSavingBudget] = useState<boolean>(false);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [newExpenseName, setNewExpenseName] = useState<string>('');
  const [newExpenseAmount, setNewExpenseAmount] = useState<string>('');
  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null);
  const [editName, setEditName] = useState<string>('');
  const [editAmount, setEditAmount] = useState<string>('');
  const [isAddingExpense, setIsAddingExpense] = useState<boolean>(false);

  // Load data from Supabase
  const loadData = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Load budget settings
      const { data: budgetData, error: budgetError } = await supabase
        .from('budget_settings')
        .select('total_budget')
        .eq('user_id', user.id)
        .maybeSingle();

      if (budgetError) throw budgetError;
      
      if (budgetData) {
        setTotalBudget(Number(budgetData.total_budget));
        setBudgetInput(budgetData.total_budget.toString());
      }

      // Load expenses
      const { data: expensesData, error: expensesError } = await supabase
        .from('budget_expenses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (expensesError) throw expensesError;

      if (expensesData) {
        setExpenses(expensesData.map(e => ({
          id: e.id,
          description: e.description,
          amount: Number(e.amount),
          date: e.date
        })));
      }
    } catch (error) {
      console.error('Error loading budget data:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load budget data. Please try again."
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    if (user) {
      loadData();
    } else {
      setTotalBudget(0);
      setExpenses([]);
      setLoading(false);
    }
  }, [user, loadData]);

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const remainingBalance = totalBudget - totalExpenses;
  const percentageUsed = totalBudget > 0 ? (totalExpenses / totalBudget) * 100 : 0;

  const handleSetBudget = async () => {
    if (!user) return;
    
    const amount = parseFloat(budgetInput);
    if (isNaN(amount) || amount < 0) {
      toast({
        variant: "destructive",
        title: "Invalid amount",
        description: "Please enter a valid positive number."
      });
      return;
    }

    setIsSavingBudget(true);
    try {
      const { error } = await supabase
        .from('budget_settings')
        .upsert({
          user_id: user.id,
          total_budget: amount
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;

      setTotalBudget(amount);
      setIsEditingBudget(false);
      toast({
        title: "Budget updated",
        description: `Total budget set to ₹${amount.toFixed(2)}`
      });
    } catch (error) {
      console.error('Error saving budget:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save budget. Please try again."
      });
    } finally {
      setIsSavingBudget(false);
    }
  };

  const handleAddExpense = async () => {
    if (!user) return;
    
    const name = newExpenseName.trim();
    const amount = parseFloat(newExpenseAmount);

    if (!name) {
      toast({
        variant: "destructive",
        title: "Missing name",
        description: "Please enter an expense name."
      });
      return;
    }

    if (isNaN(amount) || amount <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid amount",
        description: "Please enter a valid positive amount."
      });
      return;
    }

    setIsAddingExpense(true);
    try {
      const { data, error } = await supabase
        .from('budget_expenses')
        .insert({
          user_id: user.id,
          description: name,
          amount: amount,
          date: new Date().toISOString().split('T')[0]
        })
        .select()
        .single();

      if (error) throw error;

      const newExpense: Expense = {
        id: data.id,
        description: data.description,
        amount: Number(data.amount),
        date: data.date
      };

      setExpenses([newExpense, ...expenses]);
      setNewExpenseName('');
      setNewExpenseAmount('');
      toast({
        title: "Expense added",
        description: `Added ₹${amount.toFixed(2)} for ${name}`
      });
    } catch (error) {
      console.error('Error adding expense:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add expense. Please try again."
      });
    } finally {
      setIsAddingExpense(false);
    }
  };

  const handleDeleteExpense = async (id: string) => {
    if (!user) return;
    
    const expense = expenses.find(e => e.id === id);
    
    try {
      const { error } = await supabase
        .from('budget_expenses')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setExpenses(expenses.filter(e => e.id !== id));
      toast({
        title: "Expense deleted",
        description: expense ? `Removed ₹${expense.amount.toFixed(2)} for ${expense.description}` : "Expense removed"
      });
    } catch (error) {
      console.error('Error deleting expense:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete expense. Please try again."
      });
    }
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingExpenseId(expense.id);
    setEditName(expense.description);
    setEditAmount(expense.amount.toString());
  };

  const handleSaveEdit = async (id: string) => {
    if (!user) return;
    
    const name = editName.trim();
    const amount = parseFloat(editAmount);

    if (!name || isNaN(amount) || amount <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid input",
        description: "Please enter valid name and amount."
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('budget_expenses')
        .update({
          description: name,
          amount: amount
        })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setExpenses(expenses.map(e => 
        e.id === id ? { ...e, description: name, amount } : e
      ));
      setEditingExpenseId(null);
      toast({
        title: "Expense updated",
        description: `Updated to ₹${amount.toFixed(2)} for ${name}`
      });
    } catch (error) {
      console.error('Error updating expense:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update expense. Please try again."
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingExpenseId(null);
    setEditName('');
    setEditAmount('');
  };

  const handleClearAll = async () => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('budget_expenses')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;

      setExpenses([]);
      toast({
        title: "All expenses cleared",
        description: "Your expense list has been reset."
      });
    } catch (error) {
      console.error('Error clearing expenses:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to clear expenses. Please try again."
      });
    }
  };

  if (!user) {
    return (
      <Layout>
        <div className="text-center py-8">
          <p className="text-muted-foreground">Please log in to track your budget.</p>
        </div>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <h1 className="text-2xl font-bold">Budget Tracker</h1>

        {/* Total Budget Card */}
        <Card className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
                  <Wallet className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm opacity-90">Total Budget</p>
                  {isEditingBudget ? (
                    <div className="flex items-center gap-2 mt-1">
                      <Input
                        type="number"
                        value={budgetInput}
                        onChange={e => setBudgetInput(e.target.value)}
                        className="h-8 w-32 text-black"
                        placeholder="Enter amount"
                        autoFocus
                        disabled={isSavingBudget}
                      />
                      <Button size="sm" variant="secondary" onClick={handleSetBudget} disabled={isSavingBudget}>
                        {isSavingBudget ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setIsEditingBudget(false)} className="text-white hover:bg-white/20" disabled={isSavingBudget}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <p className="text-3xl font-bold">₹{totalBudget.toFixed(2)}</p>
                  )}
                </div>
              </div>
              {!isEditingBudget && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setBudgetInput(totalBudget.toString());
                    setIsEditingBudget(true);
                  }}
                  className="text-white hover:bg-white/20"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Balance Summary */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="pt-4">
              <p className="text-sm text-muted-foreground">Spent</p>
              <p className="text-2xl font-bold text-red-500">₹{totalExpenses.toFixed(2)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <p className="text-sm text-muted-foreground">Savings</p>
              <p className={`text-2xl font-bold ${remainingBalance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                ₹{remainingBalance.toFixed(2)}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Progress Bar */}
        {totalBudget > 0 && (
          <Card>
            <CardContent className="pt-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Budget Used</span>
                <span className={percentageUsed > 100 ? 'text-red-500 font-semibold' : 'text-muted-foreground'}>
                  {percentageUsed.toFixed(1)}%
                </span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 rounded-full ${
                    percentageUsed > 100 ? 'bg-red-500' : percentageUsed > 75 ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(percentageUsed, 100)}%` }}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Add Expense Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Add Expense</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expense-name">Expense Name</Label>
                <Input
                  id="expense-name"
                  placeholder="e.g., Groceries"
                  value={newExpenseName}
                  onChange={e => setNewExpenseName(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && handleAddExpense()}
                  disabled={isAddingExpense}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expense-amount">Amount (₹)</Label>
                <Input
                  id="expense-amount"
                  type="number"
                  placeholder="0.00"
                  value={newExpenseAmount}
                  onChange={e => setNewExpenseAmount(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && handleAddExpense()}
                  disabled={isAddingExpense}
                />
              </div>
            </div>
            <Button onClick={handleAddExpense} className="w-full bg-emerald-500 hover:bg-emerald-600" disabled={isAddingExpense}>
              {isAddingExpense ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Plus className="h-4 w-4 mr-2" />
              )}
              Add Expense
            </Button>
          </CardContent>
        </Card>

        {/* Expense List */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Expenses ({expenses.length})</CardTitle>
            {expenses.length > 0 && (
              <Button variant="ghost" size="sm" onClick={handleClearAll} className="text-red-500 hover:text-red-700">
                Clear All
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {expenses.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No expenses added yet. Add your first expense above!
              </p>
            ) : (
              <div className="space-y-2">
                {expenses.map(expense => (
                  <div
                    key={expense.id}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg group hover:bg-muted transition-colors"
                  >
                    {editingExpenseId === expense.id ? (
                      <div className="flex items-center gap-2 flex-1">
                        <Input
                          value={editName}
                          onChange={e => setEditName(e.target.value)}
                          className="h-8 flex-1"
                          placeholder="Name"
                        />
                        <Input
                          type="number"
                          value={editAmount}
                          onChange={e => setEditAmount(e.target.value)}
                          className="h-8 w-24"
                          placeholder="Amount"
                        />
                        <Button size="sm" variant="ghost" onClick={() => handleSaveEdit(expense.id)}>
                          <Check className="h-4 w-4 text-green-500" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={handleCancelEdit}>
                          <X className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <div>
                          <p className="font-medium">{expense.description}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(expense.date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-red-500">-₹{expense.amount.toFixed(2)}</span>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button size="sm" variant="ghost" onClick={() => handleEditExpense(expense)}>
                              <Edit2 className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteExpense(expense.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default BudgetPage;
