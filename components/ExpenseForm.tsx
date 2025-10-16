
import React, { useState, useEffect } from 'react';
import { Group, Member, Expense, ExpenseCategory, NewExpenseData, ParticipantSplit } from '../types';
import { useApp } from '../contexts/AppContext';
import Modal from './ui/Modal';
import Input from './ui/Input';
import Select from './ui/Select';
import Button from './ui/Button';

interface ExpenseFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (expense: NewExpenseData | Expense) => void;
  group: Group;
  existingExpense?: Expense | null;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ isOpen, onClose, onSave, group, existingExpense }) => {
  const { user } = useApp();
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [payerId, setPayerId] = useState(user?.id || '');
  const [participants, setParticipants] = useState<string[]>(group.members.map(m => m.id));
  const [category, setCategory] = useState<ExpenseCategory>(ExpenseCategory.Other);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (existingExpense) {
      setDescription(existingExpense.description);
      setAmount((existingExpense.amount / 100).toString());
      setPayerId(existingExpense.payerId);
      setParticipants(existingExpense.participants.map(p => p.memberId));
      setCategory(existingExpense.category);
      setDate(new Date(existingExpense.date).toISOString().split('T')[0]);
    } else {
        // Reset to default for new expense
        setDescription('');
        setAmount('');
        setPayerId(user?.id || group.members[0]?.id || '');
        setParticipants(group.members.map(m => m.id));
        setCategory(ExpenseCategory.Other);
        setDate(new Date().toISOString().split('T')[0]);
    }
  }, [existingExpense, group.members, user]);
  

  const handleParticipantChange = (memberId: string) => {
    setParticipants(prev =>
      prev.includes(memberId) ? prev.filter(id => id !== memberId) : [...prev, memberId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountInCents = Math.round(parseFloat(amount) * 100);
    if (isNaN(amountInCents) || amountInCents <= 0) {
      alert("Please enter a valid amount.");
      return;
    }
    if (participants.length === 0) {
      alert("Please select at least one participant.");
      return;
    }

    const sharePerParticipant = Math.round(amountInCents / participants.length);
    // Distribute remainder to first few participants to ensure total equals amount
    let remainder = amountInCents - (sharePerParticipant * participants.length);
    const participantSplits: ParticipantSplit[] = participants.map(memberId => {
        let finalShare = sharePerParticipant;
        if(remainder !== 0) {
            const adjustment = remainder > 0 ? 1 : -1;
            finalShare += adjustment;
            remainder -= adjustment;
        }
        return { memberId, share: finalShare };
    });

    const expenseData = {
      groupId: group.id,
      description,
      amount: amountInCents,
      payerId,
      participants: participantSplits,
      category,
      date: new Date(date).toISOString(),
    };

    if (existingExpense) {
        onSave({ ...existingExpense, ...expenseData });
    } else {
        onSave(expenseData as NewExpenseData);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={existingExpense ? "Edit Expense" : "Add Expense"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Description"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <Input
          label="Amount (₹)"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          step="0.01"
          min="0.01"
          required
        />
        <Input
          label="Date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <Select label="Paid by" value={payerId} onChange={(e) => setPayerId(e.target.value)}>
          {group.members.map(member => (
            <option key={member.id} value={member.id}>{member.name}</option>
          ))}
        </Select>
        <Select label="Category" value={category} onChange={(e) => setCategory(e.target.value as ExpenseCategory)}>
            {Object.values(ExpenseCategory).map(cat => (
                <option key={cat} value={cat}>{cat}</option>
            ))}
        </Select>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Split between</label>
          <div className="grid grid-cols-2 gap-2">
            {group.members.map(member => (
              <label key={member.id} className="flex items-center space-x-2 p-2 rounded-md bg-gray-100 dark:bg-gray-700">
                <input
                  type="checkbox"
                  checked={participants.includes(member.id)}
                  onChange={() => handleParticipantChange(member.id)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span>{member.name}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
            <Button type="submit">Save Expense</Button>
        </div>
      </form>
    </Modal>
  );
};

export default ExpenseForm;
