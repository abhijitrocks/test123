import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Group, Member, Balance, SimplifiedTransaction, Expense, NewExpenseData } from '../types';
import { useApp } from '../contexts/AppContext';
import { useToast } from '../contexts/ToastContext';
import { api } from '../services/api';
import { calculateBalances, getSimplifiedTransactions } from '../utils/debtUtils';

import Spinner from '../components/ui/Spinner';
import Button from '../components/ui/Button';
import MemberList from '../components/MemberList';
import BalanceSummary from '../components/BalanceSummary';
import SimplifiedSettlements from '../components/SimplifiedSettlements';
import ExpenseItem from '../components/ExpenseItem';
import ExpenseForm from '../components/ExpenseForm';
import InviteCard from '../components/InviteCard';

const GroupPage: React.FC = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const { user, isLoading: isUserLoading } = useApp();
  const { addToast } = useToast();

  const [group, setGroup] = useState<Group | null>(null);
  const [balances, setBalances] = useState<Balance[]>([]);
  const [simplifiedTransactions, setSimplifiedTransactions] = useState<SimplifiedTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const fetchData = useCallback(async () => {
    if (!groupId) return;
    try {
      const groupData = await api.getGroup(groupId);
      if (groupData) {
        setGroup(groupData);
        const calculatedBalances = calculateBalances(groupData);
        setBalances(calculatedBalances);
        setSimplifiedTransactions(getSimplifiedTransactions(calculatedBalances, groupData.members));
      } else {
        addToast('Group not found', 'error');
        navigate('/dashboard');
      }
    } catch (error) {
      addToast('Failed to fetch group data', 'error');
    } finally {
      setLoading(false);
    }
  }, [groupId, navigate, addToast]);

  useEffect(() => {
    if (isUserLoading) return;
    if (!user) {
        navigate('/');
        return;
    }
    fetchData();
  }, [groupId, user, isUserLoading, navigate, fetchData]);
  
  const handleOpenForm = (expense: Expense | null = null) => {
    setEditingExpense(expense);
    setIsFormOpen(true);
  };

  const handleFormSave = async (expenseData: NewExpenseData | Expense) => {
    try {
        if ('id' in expenseData) {
             await api.editExpense(expenseData as Expense);
             addToast('Expense updated successfully', 'success');
        } else {
             await api.addExpense(expenseData as NewExpenseData);
             addToast('Expense added successfully', 'success');
        }
        setIsFormOpen(false);
        setEditingExpense(null);
        fetchData();
    } catch (error) {
        addToast('Failed to save expense', 'error');
    }
  };

  const handleDeleteExpense = async (expenseId: string) => {
    if (!group) return;
    if (window.confirm('Are you sure you want to delete this expense?')) {
        try {
            await api.deleteExpense(group.id, expenseId);
            addToast('Expense deleted', 'success');
            fetchData();
        } catch (error) {
            addToast('Failed to delete expense', 'error');
        }
    }
  };
  
  const handleSettle = async (tx: SimplifiedTransaction) => {
    if (!group) return;
    try {
        await api.addSettlement(group.id, tx.from.id, tx.to.id, tx.amount);
        addToast(`Settlement from ${tx.from.name} to ${tx.to.name} recorded.`, 'success');
        fetchData();
    } catch (error) {
        addToast('Failed to record settlement.', 'error');
    }
  }


  if (loading || isUserLoading) {
    return <div className="flex justify-center items-center h-64"><Spinner size="lg" /></div>;
  }

  if (!group || !user) {
    return <p>Group not found or user not loaded.</p>;
  }
  
  const userBalance = balances.find(b => b.memberId === user.id);

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <h1 className="text-4xl font-bold">{group.name}</h1>
        <Button onClick={() => handleOpenForm()}>
            Add expense
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
            <BalanceSummary userBalance={userBalance?.balance ?? 0} />
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4">Expenses</h2>
                {group.expenses.length > 0 ? (
                    <div className="space-y-4">
                        {group.expenses.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(expense => (
                            <ExpenseItem 
                                key={expense.id} 
                                expense={expense} 
                                members={group.members}
                                onEdit={() => handleOpenForm(expense)}
                                onDelete={() => handleDeleteExpense(expense.id)}
                            />
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 dark:text-gray-400">No expenses yet. Add one to get started!</p>
                )}
            </div>
        </div>
        
        <div className="space-y-8">
            <InviteCard groupId={group.id} />
            <MemberList members={group.members} />
            <SimplifiedSettlements 
                transactions={simplifiedTransactions}
                onSettle={handleSettle}
            />
        </div>
      </div>

      {isFormOpen && (
        <ExpenseForm 
            isOpen={isFormOpen} 
            // FIX: Corrected typo from setIsFormОpen to setIsFormOpen
            onClose={() => setIsFormOpen(false)}
            onSave={handleFormSave}
            group={group}
            existingExpense={editingExpense}
        />
      )}
    </div>
  );
};

export default GroupPage;