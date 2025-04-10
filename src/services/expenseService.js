import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

export const fetchExpensesForUser = async (uid) => {
  const expensesRef = collection(db, 'users', uid, 'expenses');
  const snapshot = await getDocs(expensesRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const addExpenseForUser = async (uid, expense) => {
  const expenseId = Date.now().toString();
  const expenseRef = doc(db, 'users', uid, 'expenses', expenseId);
  await setDoc(expenseRef, expense);
};
