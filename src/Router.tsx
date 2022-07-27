import { IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import React from 'react';

import Tabs from './components/Tabs';
import GuestRoute from './guards/GuestRoute';
import ProtectedRoute from './guards/ProtectedRoute';
import useAuth from './hooks/useAuth';
import Home from './pages/auth/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Categories from './pages/Categories';
import EditProfile from './pages/EditProfile';
import ManageCategory from './pages/ManageCategory';
import ManageTransaction from './pages/ManageTransaction';
import Transactions from './pages/Transactions';

const Router: React.FC = () => {
    const { isAuthenticated } = useAuth();

    return (
        <IonReactRouter>
            <IonRouterOutlet>
                <GuestRoute exact path='/'>
                    <Home />
                </GuestRoute>
                <GuestRoute exact path='/login'>
                    <Login />
                </GuestRoute>
                <GuestRoute exact path='/register'>
                    <Register />
                </GuestRoute>
                <ProtectedRoute exact path='/transactions'>
                    <Transactions />
                </ProtectedRoute>
                <ProtectedRoute exact path='/manageTransaction'>
                    <ManageTransaction />
                </ProtectedRoute>
                <ProtectedRoute exact path='/manageTransaction/:id'>
                    <ManageTransaction />
                </ProtectedRoute>
                <ProtectedRoute exact path='/categories'>
                    <Categories />
                </ProtectedRoute>
                <ProtectedRoute exact path='/manageCategory'>
                    <ManageCategory />
                </ProtectedRoute>
                <ProtectedRoute path='/manageCategory/:id'>
                    <ManageCategory />
                </ProtectedRoute>
                <ProtectedRoute exact path='/editProfile'>
                    <EditProfile />
                </ProtectedRoute>
                <Tabs isAuthenticated={isAuthenticated} />
            </IonRouterOutlet>
        </IonReactRouter>
    );
};

export default Router;
