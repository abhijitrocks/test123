
import { Group, ExpenseCategory } from '../types';

const users = {
  alice: { id: 'user_alice', name: 'Alice' },
  bob: { id: 'user_bob', name: 'Bob' },
  charlie: { id: 'user_charlie', name: 'Charlie' },
  diana: { id: 'user_diana', name: 'Diana' },
  eve: { id: 'user_eve', name: 'Eve' },
};

export const mockGroups: Group[] = [
  {
    id: 'grp_weekend_trip',
    name: 'Weekend Trip',
    createdAt: new Date('2023-10-26T10:00:00Z').toISOString(),
    members: [users.alice, users.bob, users.charlie, users.diana],
    expenses: [
      {
        id: 'exp_1',
        groupId: 'grp_weekend_trip',
        description: 'Cabin Rental',
        amount: 40000, // $400.00
        payerId: users.alice.id,
        participants: [
          { memberId: users.alice.id, share: 10000 },
          { memberId: users.bob.id, share: 10000 },
          { memberId: users.charlie.id, share: 10000 },
          { memberId: users.diana.id, share: 10000 },
        ],
        category: ExpenseCategory.Accommodation,
        date: new Date('2023-10-27T12:00:00Z').toISOString(),
        createdAt: new Date().toISOString(),
      },
      {
        id: 'exp_2',
        groupId: 'grp_weekend_trip',
        description: 'Groceries',
        amount: 8000, // $80.00
        payerId: users.bob.id,
        participants: [
            { memberId: users.alice.id, share: 2000 },
            { memberId: users.bob.id, share: 2000 },
            { memberId: users.charlie.id, share: 2000 },
            { memberId: users.diana.id, share: 2000 },
        ],
        category: ExpenseCategory.Groceries,
        date: new Date('2023-10-27T14:00:00Z').toISOString(),
        createdAt: new Date().toISOString(),
      },
      {
        id: 'exp_3',
        groupId: 'grp_weekend_trip',
        description: 'Gas',
        amount: 5000, // $50.00
        payerId: users.charlie.id,
        participants: [
            { memberId: users.charlie.id, share: 2500 },
            { memberId: users.diana.id, share: 2500 },
        ],
        category: ExpenseCategory.Transport,
        date: new Date('2023-10-27T09:00:00Z').toISOString(),
        createdAt: new Date().toISOString(),
      },
      {
        id: 'exp_4',
        groupId: 'grp_weekend_trip',
        description: 'Dinner Out',
        amount: 12000, // $120.00
        payerId: users.diana.id,
        participants: [
            { memberId: users.alice.id, share: 3000 },
            { memberId: users.bob.id, share: 3000 },
            { memberId: users.charlie.id, share: 3000 },
            { memberId: users.diana.id, share: 3000 },
        ],
        category: ExpenseCategory.Food,
        date: new Date('2023-10-28T19:00:00Z').toISOString(),
        createdAt: new Date().toISOString(),
      },
    ],
    settlements: [],
  },
  {
    id: 'grp_flatmates',
    name: 'Flatmates',
    createdAt: new Date('2023-10-01T10:00:00Z').toISOString(),
    members: [users.alice, users.eve, users.bob],
    expenses: [
      {
        id: 'exp_5',
        groupId: 'grp_flatmates',
        description: 'October Rent',
        amount: 150000, // $1500.00
        payerId: users.alice.id,
        participants: [
          { memberId: users.alice.id, share: 50000 },
          { memberId: users.eve.id, share: 50000 },
          { memberId: users.bob.id, share: 50000 },
        ],
        category: ExpenseCategory.Accommodation,
        date: new Date('2023-10-01T10:00:00Z').toISOString(),
        createdAt: new Date().toISOString(),
      },
      {
        id: 'exp_6',
        groupId: 'grp_flatmates',
        description: 'Internet Bill',
        amount: 6000, // $60.00
        payerId: users.eve.id,
        participants: [
          { memberId: users.alice.id, share: 2000 },
          { memberId: users.eve.id, share: 2000 },
          { memberId: users.bob.id, share: 2000 },
        ],
        category: ExpenseCategory.Utilities,
        date: new Date('2023-10-15T10:00:00Z').toISOString(),
        createdAt: new Date().toISOString(),
      },
    ],
    settlements: [
      {
        id: 'set_1',
        groupId: 'grp_flatmates',
        fromId: users.bob.id,
        toId: users.alice.id,
        amount: 50000,
        date: new Date('2023-10-02T10:00:00Z').toISOString()
      }
    ],
  },
];
