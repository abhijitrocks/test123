
import { Group, Member, Balance, SimplifiedTransaction } from '../types';

/**
 * Calculates the net balance for each member in a group.
 * A positive balance means the member is owed money.
 * A negative balance means the member owes money.
 *
 * @param group - The group object containing members, expenses, and settlements.
 * @returns An array of Balance objects for each member.
 */
export const calculateBalances = (group: Group): Balance[] => {
  const balanceMap = new Map<string, number>();

  // Initialize balances for all members to 0
  group.members.forEach(member => {
    balanceMap.set(member.id, 0);
  });

  // Process expenses
  group.expenses.forEach(expense => {
    // Credit the payer
    balanceMap.set(expense.payerId, (balanceMap.get(expense.payerId) || 0) + expense.amount);

    // Debit the participants for their share
    expense.participants.forEach(participant => {
      balanceMap.set(participant.memberId, (balanceMap.get(participant.memberId) || 0) - participant.share);
    });
  });

  // Process settlements
  group.settlements.forEach(settlement => {
    // Debit the sender
    balanceMap.set(settlement.fromId, (balanceMap.get(settlement.fromId) || 0) + settlement.amount);
    // Credit the receiver
    balanceMap.set(settlement.toId, (balanceMap.get(settlement.toId) || 0) - settlement.amount);
  });

  return group.members.map(member => ({
    memberId: member.id,
    name: member.name,
    balance: Math.round(balanceMap.get(member.id) || 0), // Round to nearest cent to handle potential float errors
  }));
};

/**
 * Simplifies debts into the minimum number of transactions required to settle all balances.
 * This function implements a greedy algorithm.
 * 
 * How it works:
 * 1.  Calculate the net balance for every member.
 * 2.  Separate members into two groups: `creditors` (positive balance, are owed money)
 *     and `debtors` (negative balance, owe money).
 * 3.  Sort creditors descending (person owed the most is first) and debtors ascending
 *     (person who owes the most is first).
 * 4.  In a loop, match the largest debtor with the largest creditor:
 *     a.  The amount to be transferred is the minimum of what the debtor owes and
 *         what the creditor is owed.
 *     b.  Create a transaction for this amount.
 *     c.  Update the balances of both the debtor and creditor.
 *     d.  If a member's balance becomes zero, they are removed from their respective list.
 * 5.  Repeat until both lists are empty.
 *
 * This ensures the number of payments is minimized. For example, if A owes B $10 and B owes C $10,
 * the simplified transaction is A pays C $10.
 *
 * @param balances - An array of Balance objects for each member.
 * @param members - An array of all members in the group.
 * @returns An array of SimplifiedTransaction objects.
 */
export const getSimplifiedTransactions = (balances: Balance[], members: Member[]): SimplifiedTransaction[] => {
  const membersMap = new Map(members.map(m => [m.id, m]));

  const creditors = balances
    .filter(b => b.balance > 0)
    .sort((a, b) => b.balance - a.balance);
  
  const debtors = balances
    .filter(b => b.balance < 0)
    .sort((a, b) => a.balance - b.balance);

  const transactions: SimplifiedTransaction[] = [];

  let creditorIndex = 0;
  let debtorIndex = 0;

  while (creditorIndex < creditors.length && debtorIndex < debtors.length) {
    const creditor = creditors[creditorIndex];
    const debtor = debtors[debtorIndex];
    
    const creditorBalance = creditor.balance;
    const debtorBalance = debtor.balance;

    const amountToTransfer = Math.min(creditorBalance, -debtorBalance);

    if (amountToTransfer > 0.5) { // Threshold to avoid tiny floating point transactions
      transactions.push({
        from: membersMap.get(debtor.memberId)!,
        to: membersMap.get(creditor.memberId)!,
        amount: Math.round(amountToTransfer),
      });

      creditor.balance -= amountToTransfer;
      debtor.balance += amountToTransfer;
    }

    if (Math.abs(creditor.balance) < 0.5) {
      creditorIndex++;
    }

    if (Math.abs(debtor.balance) < 0.5) {
      debtorIndex++;
    }
  }

  return transactions;
};
