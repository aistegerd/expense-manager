import React from 'react';
import { Redirect, Route } from 'react-router-dom';

import useAuth from 'hooks/useAuth';

const GuestRoute = ({ children, ...props }) => {
    const { isAuthenticated } = useAuth();

    return (
        <Route
            {...props}
            render={() =>
                !isAuthenticated ? (
                    children
                ) : (
                    <Redirect
                        to={{
                            pathname: '/dashboard',
                        }}
                    />
                )
            }
        />
    );
};

export default GuestRoute;
