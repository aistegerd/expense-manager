import React from 'react';
import { Redirect, Route } from 'react-router-dom';

import useAuth from 'hooks/useAuth';

const ProtectedRoute = ({ children, ...props }) => {
    const { isAuthenticated } = useAuth();

    return (
        <Route
            {...props}
            render={({ location }) =>
                isAuthenticated ? (
                    children
                ) : (
                    <Redirect
                        to={{
                            pathname: '/login',
                            state: { from: location },
                        }}
                    />
                )
            }
        />
    );
};

export default ProtectedRoute;
