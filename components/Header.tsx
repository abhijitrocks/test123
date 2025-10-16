
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import Button from './ui/Button';

const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);


const Header: React.FC = () => {
  const { user, setUser } = useApp();
  const navigate = useNavigate();

  const handleSignOut = () => {
    setUser(null);
    navigate('/');
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to={user ? "/dashboard" : "/"} className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              FairShare
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/dashboard" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition">Dashboard</Link>
                <Link to="/settings" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition">Settings</Link>
                <div className="flex items-center space-x-2">
                    <UserIcon />
                    <span className="font-medium">{user.name}</span>
                </div>
                <Button onClick={handleSignOut} variant="secondary" size="sm">Sign Out</Button>
              </>
            ) : (
                <span className="text-gray-500">Welcome!</span>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
