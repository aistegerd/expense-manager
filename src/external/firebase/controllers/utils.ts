interface FirebaseErrorMessages {
    [index: string]: string;
}

const FIREBASE_AUTH_ERROR_MESSAGES_MAP: FirebaseErrorMessages = {
    'auth/email-already-in-use': 'The provided email is already in use by an existing user.',
    'auth/expired-action-code': 'The link has expired.',
    'auth/invalid-action-code': 'The link is tampered or was used before.',
    'auth/invalid-email': 'The provided email is invalid.',
    'auth/invalid-user-token': 'The user token is invalid.',
    'auth/user-disabled': 'The user is disabled.',
    'auth/user-not-found': 'The user is not found.',
    'auth/user-token-expired': 'The user token is expired.',
    'auth/weak-password': 'Password is too weak.',
    'auth/wrong-password': 'Incorrect credentials.',
};

export const formatErrorMessage = (error: any) => {
    if (error?.code) {
        if (FIREBASE_AUTH_ERROR_MESSAGES_MAP[error.code]) {
            return { ok: false, message: FIREBASE_AUTH_ERROR_MESSAGES_MAP[error.code] };
        }
        return { ok: false, message: `Something went wrong. Error code: ${error.code}` };
    }
    return {
        ok: false,
        message: 'Something went wrong. Please try again later or contact system administrator if the issue persists.',
    };
};
