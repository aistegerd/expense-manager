import { updateProfile } from 'firebase/auth';
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    DocumentData,
    getDoc,
    getDocs,
    orderBy,
    query,
    UpdateData,
    updateDoc,
    where,
} from 'firebase/firestore';

import { auth, db } from 'external/firebase/index';

export const getTransactions = async (userUid: string, limit?: Date, type?: string) => {
    try {
        const transactions: DocumentData[] = [];
        const transactionsWithCategory: DocumentData[] = [];
        const docRef = doc(db, 'users', userUid);

        let q;
        if (limit && type) {
            q = query(
                collection(docRef, 'transactions'),
                where('date', '>=', limit),
                where('isIncome', '==', type === 'income' || false),
                orderBy('date', 'desc'),
            );
        } else if (limit) {
            q = query(collection(docRef, 'transactions'), where('date', '>=', limit), orderBy('date', 'desc'));
        } else if (type) {
            q = query(
                collection(docRef, 'transactions'),
                where('isIncome', '==', type === 'income' || false),
                orderBy('date', 'desc'),
            );
        } else {
            q = query(collection(docRef, 'transactions'), orderBy('date', 'desc'));
        }

        const querySnap = await getDocs(q);
        querySnap.forEach(docSnap => {
            // @ts-ignore
            transactions.push({ id: docSnap.id, ...docSnap.data() });
        });
        // eslint-disable-next-line no-restricted-syntax
        for (const transaction of transactions) {
            // eslint-disable-next-line no-await-in-loop,@typescript-eslint/no-use-before-define
            const category = await getCategoryByRef(transaction.category);
            // @ts-ignore
            transactionsWithCategory.push({ ...transaction, category: category?.name, color: category?.color });
        }
        return transactionsWithCategory;
    } catch (error) {
        return { error };
    }
};

export const getTransactionById = async (id: string) => {
    try {
        if (!auth.currentUser) {
            return [];
        }
        const docRef = doc(db, 'users', auth.currentUser.uid, 'transactions', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const transaction = docSnap.data();
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            const category = await getCategoryByRef(transaction.category);
            // @ts-ignore
            return { ...transaction, category: category?.name, color: category?.color };
        }
        return { error: { message: 'No such document!' } };
    } catch (error) {
        return { error };
    }
};

export const addTransaction = async (
    amount: number,
    categoryId: string,
    currency: string,
    date: Date,
    isIncome: boolean,
    notes: string,
    title: string,
) => {
    try {
        console.log(Date);
        if (!auth.currentUser) {
            return { ok: false, message: 'No current user found' };
        }
        const docRef = doc(db, 'users', auth.currentUser.uid);
        const categoryDocRef = doc(db, 'users', auth.currentUser.uid, 'categories', categoryId);
        await addDoc(collection(docRef, 'transactions'), {
            amount,
            category: categoryDocRef,
            currency,
            date,
            isIncome,
            notes,
            title,
        });
        return { ok: true, message: 'New transaction added successfully' };
    } catch (error) {
        console.log(error);
        return { error };
    }
};

export const updateTransaction = async (
    transactionId: string,
    amount: number,
    categoryId: string,
    currency: string,
    date: Date,
    isIncome: boolean,
    notes: string,
    title: string,
) => {
    try {
        if (!auth.currentUser) {
            return { ok: false, message: 'No current user found' };
        }
        const docRef = doc(db, 'users', auth.currentUser.uid, 'transactions', transactionId);
        const categoryDocRef = doc(db, 'users', auth.currentUser.uid, 'categories', categoryId);
        await updateDoc(docRef, {
            amount,
            category: categoryDocRef,
            currency,
            date,
            isIncome,
            notes,
            title,
        });
        return { ok: true, message: 'Transaction updated successfully' };
    } catch (error) {
        return { error };
    }
};

export const deleteTransaction = async (transactionId: string) => {
    try {
        if (!auth.currentUser) {
            return { ok: false, message: 'No current user found' };
        }
        const docRef = doc(db, 'users', auth.currentUser.uid, 'transactions', transactionId);
        await deleteDoc(docRef);
        return { ok: true, message: 'Transaction deleted successfully' };
    } catch (error) {
        return { error };
    }
};

export const getCategoryByRef = async docRef => {
    const docSnap = await getDoc(docRef);
    return docSnap.data();
};

export const getCategoryById = async (id: string) => {
    try {
        if (!auth.currentUser) {
            return [];
        }
        const docRef = doc(db, 'users', auth.currentUser.uid, 'categories', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data();
        }
        return { error: { message: 'No such document!' } };
    } catch (error) {
        return { error };
    }
};

export const getCategoriesByType = async (type: string) => {
    try {
        if (!auth.currentUser) {
            return [];
        }
        const categories: DocumentData[] = [];
        const docRef = doc(db, 'users', auth.currentUser.uid);
        const q = query(
            collection(docRef, 'categories'),
            where('isIncomeCategory', '==', type === 'income' || false),
            orderBy('name', 'desc'),
        );
        const querySnap = await getDocs(q);
        querySnap.forEach(docSnap => {
            categories.push({ id: docSnap.id, ...docSnap.data() });
        });
        return categories;
    } catch (error) {
        return { error };
    }
};

export const addCategory = async (isIncomeCategory: boolean, name: string, color: string) => {
    try {
        if (!auth.currentUser) {
            return { ok: false, message: 'No current user found' };
        }
        const docRef = doc(db, 'users', auth.currentUser.uid);
        await addDoc(collection(docRef, 'categories'), {
            isIncomeCategory,
            name,
            color,
        });
        return { ok: true, message: 'New category added successfully' };
    } catch (error) {
        return { error };
    }
};

export const updateCategory = async (categoryId: string, isIncomeCategory: boolean, name: string, color: string) => {
    try {
        if (!auth.currentUser) {
            return { ok: false, message: 'No current user found' };
        }
        const docRef = doc(db, 'users', auth.currentUser.uid, 'categories', categoryId);
        await updateDoc(docRef, {
            isIncomeCategory,
            name,
            color,
        });
        return { ok: true, message: 'Category updated successfully' };
    } catch (error) {
        return { error };
    }
};

export const deleteCategory = async (categoryId: string) => {
    try {
        if (!auth.currentUser) {
            return { ok: false, message: 'No current user found' };
        }
        const docRef = doc(db, 'users', auth.currentUser.uid, 'categories', categoryId);
        await deleteDoc(docRef);
        return { ok: true, message: 'Category deleted successfully' };
    } catch (error) {
        return { error };
    }
};

export const getUserProfile = async (userUid: string) => {
    try {
        const docRef = doc(db, 'users', userUid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data();
        }
        return { error: { message: 'No such document!' } };
    } catch (error) {
        return { error };
    }
};

export const updateUser = async (displayName: string, photoURL: string) => {
    try {
        if (!auth.currentUser) {
            return { ok: false, message: 'No current user found' };
        }
        const docRef = doc(db, 'users', auth.currentUser.uid);
        await updateDoc(docRef, { displayName } as UpdateData<never>);
        await updateProfile(auth.currentUser, {
            displayName,
            photoURL,
        });
        return { ok: true, message: 'User profile updated successfully' };
    } catch (error) {
        return { error };
    }
};

export const updateUserDefaultCurrency = async (defaultCurrency: string) => {
    try {
        if (!auth.currentUser) {
            return { ok: false, message: 'No current user found' };
        }
        const docRef = doc(db, 'users', auth.currentUser.uid);
        await updateDoc(docRef, { defaultCurrency } as UpdateData<never>);
        return { ok: true, message: 'User default currency updated' };
    } catch (error) {
        return { error };
    }
};

export const updateUserRemindersPreference = async (areRemindersAllowed: boolean) => {
    try {
        if (!auth.currentUser) {
            return { ok: false, message: 'No current user found' };
        }
        const docRef = doc(db, 'users', auth.currentUser.uid);
        await updateDoc(docRef, { areRemindersAllowed } as UpdateData<never>);
        return { ok: true, message: 'User reminders preference updated' };
    } catch (error) {
        return { error };
    }
};
