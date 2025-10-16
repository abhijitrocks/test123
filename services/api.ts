
import { Group, User, Member, Expense, Settlement, NewExpenseData } from '../types';
import { mockGroups } from '../data/mockData';

const STORAGE_KEY = 'fairshare_data';

// --- Helper Functions ---

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const getStoredData = (): { groups: Group[] } => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : { groups: [] };
  } catch (error) {
    console.error("Failed to read from localStorage", error);
    return { groups: [] };
  }
};

const setStoredData = (data: { groups: Group[] }) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Failed to write to localStorage", error);
  }
};

// --- API Functions ---

export const api = {
  // Seeds localStorage with mock data if it's empty
  seedInitialData: async (): Promise<void> => {
    await delay(200);
    const data = getStoredData();
    if (data.groups.length === 0) {
      setStoredData({ groups: mockGroups });
    }
  },

  // Creates a new group
  createGroup: async (groupName: string, creator: User): Promise<Group> => {
    await delay(500);
    const data = getStoredData();
    const newGroup: Group = {
      id: `grp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: groupName,
      members: [{ ...creator }],
      expenses: [],
      settlements: [],
      createdAt: new Date().toISOString(),
    };
    data.groups.push(newGroup);
    setStoredData(data);
    return newGroup;
  },

  // Joins an existing group
  joinGroup: async (groupId: string, user: User): Promise<Group | null> => {
    await delay(500);
    const data = getStoredData();
    const group = data.groups.find(g => g.id === groupId);
    if (!group) {
      return null;
    }
    if (!group.members.some(m => m.id === user.id)) {
      group.members.push({ ...user });
      setStoredData(data);
    }
    return group;
  },

  // Retrieves a single group by its ID
  getGroup: async (groupId: string): Promise<Group | null> => {
    await delay(300);
    const data = getStoredData();
    const group = data.groups.find(g => g.id === groupId);
    return group || null;
  },

  // Lists all groups a specific user is a member of
  listGroupsForUser: async (userId: string): Promise<Group[]> => {
    await delay(400);
    const data = getStoredData();
    return data.groups.filter(g => g.members.some(m => m.id === userId));
  },

  // Adds a new expense to a group
  addExpense: async (expenseData: NewExpenseData): Promise<Expense> => {
    await delay(500);
    const data = getStoredData();
    const group = data.groups.find(g => g.id === expenseData.groupId);
    if (!group) {
      throw new Error("Group not found");
    }
    const newExpense: Expense = {
      ...expenseData,
      id: `exp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    };
    group.expenses.push(newExpense);
    setStoredData(data);
    return newExpense;
  },
  
  // Edits an existing expense
  editExpense: async (updatedExpense: Expense): Promise<Expense> => {
    await delay(500);
    const data = getStoredData();
    const group = data.groups.find(g => g.id === updatedExpense.groupId);
    if (!group) {
      throw new Error("Group not found");
    }
    const expenseIndex = group.expenses.findIndex(e => e.id === updatedExpense.id);
    if (expenseIndex === -1) {
        throw new Error("Expense not found");
    }
    group.expenses[expenseIndex] = updatedExpense;
    setStoredData(data);
    return updatedExpense;
  },

  // Deletes an expense from a group
  deleteExpense: async (groupId: string, expenseId: string): Promise<void> => {
    await delay(500);
    const data = getStoredData();
    const group = data.groups.find(g => g.id === groupId);
    if (group) {
      group.expenses = group.expenses.filter(e => e.id !== expenseId);
      setStoredData(data);
    }
  },

  // Adds a settlement to a group
  addSettlement: async (groupId: string, fromId: string, toId: string, amount: number): Promise<Settlement> => {
    await delay(500);
    const data = getStoredData();
    const group = data.groups.find(g => g.id === groupId);
    if (!group) {
        throw new Error("Group not found");
    }
    const newSettlement: Settlement = {
        id: `set_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        groupId,
        fromId,
        toId,
        amount,
        date: new Date().toISOString(),
    };
    group.settlements.push(newSettlement);
    setStoredData(data);
    return newSettlement;
  },

  // Retrieves all data for export
  exportData: async (): Promise<string> => {
    await delay(200);
    const data = getStoredData();
    return JSON.stringify(data, null, 2);
  },

  // Imports data from a JSON string, overwriting existing data
  importData: async (jsonString: string): Promise<void> => {
    await delay(500);
    try {
      const data = JSON.parse(jsonString);
      if (data && Array.isArray(data.groups)) {
        setStoredData(data);
      } else {
        throw new Error("Invalid data format");
      }
    } catch (error) {
      console.error("Failed to import data", error);
      throw error;
    }
  },
};
