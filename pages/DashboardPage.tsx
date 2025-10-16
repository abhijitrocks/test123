
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { api } from '../services/api';
import { Group, Balance } from '../types';
import { calculateBalances } from '../utils/debtUtils';
import Card from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';

const DashboardPage: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, isLoading: isUserLoading } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isUserLoading && !user) {
      navigate('/');
    } else if (user) {
      api.listGroupsForUser(user.id).then(userGroups => {
        setGroups(userGroups);
        setLoading(false);
      });
    }
  }, [user, navigate, isUserLoading]);

  const getUserBalanceInGroup = (group: Group): number => {
    if (!user) return 0;
    const balances = calculateBalances(group);
    const userBalance = balances.find(b => b.memberId === user.id);
    return userBalance ? userBalance.balance : 0;
  };

  const totalNetBalance = groups.reduce((total, group) => total + getUserBalanceInGroup(group), 0);
  
  const formatCurrency = (amount: number) => {
      return (amount / 100).toLocaleString('en-IN', { style: 'currency', currency: 'INR' });
  };

  if (loading || isUserLoading) {
    return <div className="flex justify-center items-center h-64"><Spinner size="lg" /></div>;
  }

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Your Dashboard</h1>
      
      <Card className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Total Net Balance</h2>
        <p className={`text-3xl font-bold ${totalNetBalance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          {formatCurrency(totalNetBalance)}
        </p>
        <p className="text-gray-500 dark:text-gray-400">
          {totalNetBalance >= 0 ? 'Overall, you are owed money.' : 'Overall, you owe money.'}
        </p>
      </Card>
      
      <h2 className="text-2xl font-bold mb-4">Your Groups</h2>
      {groups.length === 0 ? (
        <p>You are not a member of any groups yet. Create or join one!</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map(group => {
            const balance = getUserBalanceInGroup(group);
            return (
              <Link to={`/group/${group.id}`} key={group.id}>
                <Card className="hover:shadow-lg hover:border-indigo-500 transition-all duration-200 h-full">
                  <h3 className="text-xl font-bold mb-2">{group.name}</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">{group.members.length} members</p>
                  <div>
                    <span className="font-semibold">Your balance: </span>
                    <span className={balance >= 0 ? 'text-green-500' : 'text-red-500'}>
                      {formatCurrency(balance)}
                    </span>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
