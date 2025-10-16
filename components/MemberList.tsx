
import React from 'react';
import { Member } from '../types';
import Card from './ui/Card';

interface MemberListProps {
  members: Member[];
}

const MemberList: React.FC<MemberListProps> = ({ members }) => {
  return (
    <Card>
      <h3 className="text-lg font-bold mb-4">{members.length} Members</h3>
      <ul className="space-y-2">
        {members.map(member => (
          <li key={member.id} className="flex items-center space-x-3">
            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-200 dark:bg-indigo-800 flex items-center justify-center">
              <span className="text-indigo-700 dark:text-indigo-200 font-bold">{member.name.charAt(0).toUpperCase()}</span>
            </div>
            <span className="font-medium">{member.name}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
};

export default MemberList;
