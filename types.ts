
export interface User {
  id: string;
  name: string;
}

export interface Member extends User {}

export interface Group {
  id: string;
  name: string;
  members: Member[];
  expenses: Expense[];
  settlements: Settlement[];
  createdAt: string;
}

export interface Expense {
  id: string;
  groupId: string;
  description: string;
  amount: number; // in cents
  payerId: string;
  participants: ParticipantSplit[];
  category: ExpenseCategory;
  date: string;
  createdAt: string;
  isSettled?: boolean; 
}

export interface ParticipantSplit {
    memberId: string;
    share: number; // in cents
}

export interface Settlement {
    id: string;
    groupId: string;
    fromId: string;
    toId: string;
    amount: number; // in cents
    date: string;
}

export enum ExpenseCategory {
    Food = "Food",
    Transport = "Transport",
    Accommodation = "Accommodation",
    Groceries = "Groceries",
    Utilities = "Utilities",
    Entertainment = "Entertainment",
    Other = "Other",
}

export interface Balance {
  memberId: string;
  name: string;
  balance: number; // in cents
}

export interface SimplifiedTransaction {
    from: Member;
    to: Member;
    amount: number; // in cents
}

export type NewExpenseData = Omit<Expense, 'id' | 'createdAt' | 'isSettled'>;
