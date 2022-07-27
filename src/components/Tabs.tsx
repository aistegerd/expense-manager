import { IonContent, IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from '@ionic/react';
import { barChart, home, person } from 'ionicons/icons';
import React from 'react';

import ProtectedRoute from 'guards/ProtectedRoute';
import Dashboard from 'pages/Dashboard';
import Profile from 'pages/Profile';
import Statistics from 'pages/Statistics';

const Tabs = ({ isAuthenticated }) => {
    return (
        <IonContent>
            <IonTabs>
                <IonRouterOutlet>
                    <ProtectedRoute exact path='/dashboard'>
                        <Dashboard />
                    </ProtectedRoute>
                    <ProtectedRoute exact path='/statistics'>
                        <Statistics />
                    </ProtectedRoute>
                    <ProtectedRoute exact path='/profile'>
                        <Profile />
                    </ProtectedRoute>
                </IonRouterOutlet>
                {isAuthenticated && (
                    <IonTabBar slot='bottom'>
                        <IonTabButton tab='dashboard' href='/dashboard'>
                            <IonIcon icon={home} />
                            <IonLabel>Home</IonLabel>
                        </IonTabButton>
                        <IonTabButton tab='statistics' href='/statistics'>
                            <IonIcon icon={barChart} />
                            <IonLabel>Statistics</IonLabel>
                        </IonTabButton>
                        <IonTabButton tab='profile' href='/profile'>
                            <IonIcon icon={person} />
                            <IonLabel>Profile</IonLabel>
                        </IonTabButton>
                    </IonTabBar>
                )}
            </IonTabs>
        </IonContent>
    );
};

export default Tabs;
