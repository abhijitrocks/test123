
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { api } from '../services/api';
import { useToast } from '../contexts/ToastContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';

const LandingPage: React.FC = () => {
  const [userName, setUserName] = useState('');
  const [groupName, setGroupName] = useState('');
  const [joinGroupId, setJoinGroupId] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const { user, setUser } = useApp();
  const navigate = useNavigate();
  const { addToast } = useToast();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
    // Seed data on first load
    api.seedInitialData();
  }, [user, navigate]);

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !groupName.trim()) {
      addToast('Please enter your name and a group name.', 'error');
      return;
    }
    setIsCreating(true);
    try {
      const newUser = { id: `user_${Date.now()}`, name: userName };
      const newGroup = await api.createGroup(groupName, newUser);
      setUser(newUser);
      addToast(`Group "${groupName}" created successfully!`, 'success');
      navigate(`/group/${newGroup.id}`);
    } catch (error) {
      addToast('Failed to create group. Please try again.', 'error');
    } finally {
      setIsCreating(false);
    }
  };

  const handleJoinGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !joinGroupId.trim()) {
      addToast('Please enter your name and a group ID.', 'error');
      return;
    }
    setIsJoining(true);
    try {
      const newUser = { id: `user_${Date.now()}`, name: userName };
      const group = await api.joinGroup(joinGroupId, newUser);
      if (group) {
        setUser(newUser);
        addToast(`Successfully joined "${group.name}"!`, 'success');
        navigate(`/group/${group.id}`);
      } else {
        addToast('Group not found. Please check the ID.', 'error');
      }
    } catch (error) {
      addToast('Failed to join group. Please try again.', 'error');
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto text-center">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
        Split Expenses, Not Friendships
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-12">
        FairShare makes it easy to track shared bills and IOUs with friends, family, and flatmates.
      </p>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <h2 className="text-2xl font-bold mb-4">Create a new group</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Create a group — no signup</p>
          <form onSubmit={handleCreateGroup} className="space-y-4">
            <Input
              type="text"
              placeholder="Your Name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              aria-label="Your Name"
              required
            />
            <Input
              type="text"
              placeholder="Group Name (e.g., Weekend Trip)"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              aria-label="Group Name"
              required
            />
            <Button type="submit" disabled={isCreating} className="w-full">
              {isCreating ? <Spinner /> : 'Create Group'}
            </Button>
          </form>
        </Card>

        <Card>
          <h2 className="text-2xl font-bold mb-4">Join an existing group</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Have a group ID or link? Join here.</p>
          <form onSubmit={handleJoinGroup} className="space-y-4">
            <Input
              type="text"
              placeholder="Your Name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              aria-label="Your Name for Joining"
              required
            />
            <Input
              type="text"
              placeholder="Paste Group ID"
              value={joinGroupId}
              onChange={(e) => setJoinGroupId(e.target.value)}
              aria-label="Group ID"
              required
            />
            <Button type="submit" variant="secondary" disabled={isJoining} className="w-full">
              {isJoining ? <Spinner /> : 'Join Group'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default LandingPage;
