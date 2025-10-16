
import React from 'react';
import Card from './ui/Card';

interface BalanceSummaryProps {
  userBalance: number;
}

const BalanceSummary: React.FC<BalanceSummaryProps> = ({ userBalance }) => {

    const formatCurrency = (amount: number) => {
        return (amount / 100).toLocaleString('en-IN', { style: 'currency', currency: 'INR' });
    };

    const balanceText = userBalance > 0 ? "You are owed" : userBalance < 0 ? "You owe" : "You are all settled up";
    const balanceColor = userBalance > 0 ? "text-green-500" : userBalance < 0 ? "text-red-500" : "text-gray-500";

    return (
        <Card>
            <h2 className="text-lg font-semibold mb-2">{balanceText}</h2>
            <p className={`text-4xl font-bold ${balanceColor}`}>
                {formatCurrency(Math.abs(userBalance))}
            </p>
        </Card>
    );
};

export default BalanceSummary;
