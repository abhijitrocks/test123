
import React from 'react';
import { Expense, Member, ExpenseCategory } from '../types';
import Button from './ui/Button';

interface ExpenseItemProps {
  expense: Expense;
  members: Member[];
  onEdit: () => void;
  onDelete: () => void;
}

const CategoryIcon: React.FC<{ category: ExpenseCategory }> = ({ category }) => {
    const icons: Record<ExpenseCategory, React.ReactNode> = {
        [ExpenseCategory.Food]: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m-4 4V7a4 4 0 00-8 0v14h8zM3 17h4v4H3z"/></svg>,
        [ExpenseCategory.Transport]: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 21c-3.866 0-7-3.134-7-7s3.134-7 7-7 7 3.134 7 7-3.134 7-7 7z"/></svg>,
        [ExpenseCategory.Accommodation]: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>,
        [ExpenseCategory.Groceries]: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4z"/></svg>,
        [ExpenseCategory.Utilities]: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>,
        [ExpenseCategory.Entertainment]: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>,
        [ExpenseCategory.Other]: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 12h14M5 16h14"/></svg>,
    };
    return <div className="p-2 bg-gray-200 dark:bg-gray-700 rounded-full">{icons[category]}</div>
}

const ExpenseItem: React.FC<ExpenseItemProps> = ({ expense, members, onEdit, onDelete }) => {
  const payer = members.find(m => m.id === expense.payerId);

  const formatCurrency = (amount: number) => {
    return (amount / 100).toLocaleString('en-IN', { style: 'currency', currency: 'INR' });
  };

  const formattedDate = new Date(expense.date).toLocaleDateString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric'
  });

  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border dark:border-gray-600">
      <div className="flex items-center space-x-4">
        <CategoryIcon category={expense.category} />
        <div>
          <p className="font-bold">{expense.description}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {payer?.name} paid {formatCurrency(expense.amount)}
          </p>
          <p className="text-xs text-gray-400">{formattedDate}</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Button onClick={onEdit} variant="secondary" size="sm">Edit</Button>
        <Button onClick={onDelete} variant="danger" size="sm">Delete</Button>
      </div>
    </div>
  );
};

export default ExpenseItem;
