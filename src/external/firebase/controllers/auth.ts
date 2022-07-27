import {
    createUserWithEmailAndPassword,
    deleteUser,
    EmailAuthProvider,
    reauthenticateWithCredential,
    signInWithEmailAndPassword,
    signOut,
    updatePassword,
    updateProfile,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

import { auth, db } from 'external/firebase/index';

import { formatErrorMessage } from './utils';

export const login = async (email: string, password: string) => {
    try {
        await signInWithEmailAndPassword(auth, email, password);
        return { ok: true, message: 'Logged in successfully' };
    } catch (error) {
        return formatErrorMessage(error);
    }
};

export const register = async (name: string, email: string, password: string) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const docRef = doc(db, 'users', userCredential.user.uid);
        await setDoc(docRef, {
            email: userCredential.user.email,
            displayName: name,
            areRemindersAllowed: false,
            defaultCurrency: 'eur',
        });
        await updateProfile(userCredential.user, {
            displayName: name,
        });
        return { ok: true, message: 'Registered successfully' };
    } catch (error) {
        return formatErrorMessage(error);
    }
};

export const updateCredentials = async (oldPassword: string, newPassword: string) => {
    try {
        if (!auth.currentUser || !auth.currentUser.email) {
            return { ok: false, message: 'No current user found.' };
        }
        const emailCredential = EmailAuthProvider.credential(auth.currentUser.email, oldPassword);
        await reauthenticateWithCredential(auth.currentUser, emailCredential);
        await updatePassword(auth.currentUser, newPassword);
        return { ok: true, message: 'Password updated successfully' };
    } catch (error) {
        return formatErrorMessage(error);
    }
};

export const deleteAccount = async () => {
    if (!auth.currentUser) {
        return;
    }
    await deleteUser(auth.currentUser);
};

export const logout = async () => {
    await signOut(auth);
};
