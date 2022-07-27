import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, DocumentData, onSnapshot } from 'firebase/firestore';
import React, { createContext, useEffect, useState } from 'react';

import { auth, db } from 'external/firebase';
import { getUserProfile } from 'external/firebase/controllers/db';

interface UserState {
    isAuthenticated: boolean;
    isInitialized: boolean;
    user: User | null;
    profile?: DocumentData;
}

const initialUserState: UserState = {
    isAuthenticated: false,
    isInitialized: false,
    user: null,
};

const AuthContext = createContext(initialUserState);

const AuthProvider: React.FunctionComponent = ({ children }) => {
    const [profile, setProfile] = useState<DocumentData>();
    const [userState, setUserState] = useState(initialUserState);

    const handleStateChange = async user => {
        if (user) {
            onSnapshot(doc(db, 'users', user.uid), doc => setProfile(doc.data()));
            const userProfile = await getUserProfile(user.uid);
            setProfile(userProfile);
            setUserState({
                ...userState,
                isAuthenticated: true,
                isInitialized: true,
                user,
            });
        } else {
            setUserState({
                ...userState,
                isAuthenticated: false,
                isInitialized: true,
                user: null,
            });
        }
    };

    useEffect(() => {
        onAuthStateChanged(auth, handleStateChange);
    }, [auth]);

    return (
        <AuthContext.Provider
            value={{
                ...userState,
                profile,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };
