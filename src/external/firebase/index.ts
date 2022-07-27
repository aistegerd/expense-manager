import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

import { firebaseConfig } from './config';

initializeApp(firebaseConfig);

export const auth = getAuth();
export const db = getFirestore();
