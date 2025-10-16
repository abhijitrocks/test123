
import React from 'react';
import Card from './ui/Card';
import Button from './ui/Button';
import Input from './ui/Input';
import { useToast } from '../contexts/ToastContext';

interface InviteCardProps {
  groupId: string;
}

const CopyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
);

const InviteCard: React.FC<InviteCardProps> = ({ groupId }) => {
  const { addToast } = useToast();
  // In a real app, this would be a full URL. Here we simulate it.
  const inviteLink = `fairshare.app/g/${groupId}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(groupId).then(() => {
      addToast('Group ID copied to clipboard!', 'success');
    }, (err) => {
      addToast('Failed to copy!', 'error');
      console.error('Could not copy text: ', err);
    });
  };

  return (
    <Card>
      <h3 className="text-lg font-bold mb-2">Invite Friends</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Share this group ID with others to join.</p>
      <div className="flex space-x-2">
        <Input
          type="text"
          value={groupId}
          readOnly
          className="bg-gray-100 dark:bg-gray-900"
          onFocus={(e) => e.target.select()}
        />
        <Button onClick={copyToClipboard} aria-label="Copy invite link">
            <CopyIcon />
            Copy
        </Button>
      </div>
    </Card>
  );
};

export default InviteCard;
