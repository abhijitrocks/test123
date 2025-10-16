
import React from 'react';
import { SimplifiedTransaction } from '../types';
import Card from './ui/Card';
import Button from './ui/Button';

interface SimplifiedSettlementsProps {
  transactions: SimplifiedTransaction[];
  onSettle: (transaction: SimplifiedTransaction) => void;
}

const ArrowRightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mx-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
)

const SimplifiedSettlements: React.FC<SimplifiedSettlementsProps> = ({ transactions, onSettle }) => {
    
    const formatCurrency = (amount: number) => {
        return (amount / 100).toLocaleString('en-IN', { style: 'currency', currency: 'INR' });
    };
    
    return (
        <Card>
            <h3 className="text-lg font-bold mb-4">Who Owes Who</h3>
            {transactions.length > 0 ? (
                <ul className="space-y-3">
                    {transactions.map((tx, index) => (
                        <li key={index} className="flex flex-col p-3 bg-gray-100 dark:bg-gray-700/50 rounded-md">
                            <div className="flex items-center justify-between text-sm font-medium">
                                <span className="text-red-500">{tx.from.name}</span>
                                <ArrowRightIcon />
                                <span className="text-green-500">{tx.to.name}</span>
                            </div>
                            <div className="flex items-center justify-between mt-2">
                                <span className="font-bold text-lg">{formatCurrency(tx.amount)}</span>
                                <Button onClick={() => onSettle(tx)} size="sm">
                                    Settle
                                </Button>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">Everyone is settled up!</p>
            )}
        </Card>
    );
};

export default SimplifiedSettlements;
