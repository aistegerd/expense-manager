import {
    IonAvatar,
    IonCardTitle,
    IonCol,
    IonContent,
    IonGrid,
    IonHeader,
    IonItem,
    IonLabel,
    IonList,
    IonListHeader,
    IonPage,
    IonRow,
    IonSelect,
    IonSelectOption,
    IonTitle,
    IonToggle,
    useIonAlert,
} from '@ionic/react';
import React, { useEffect, useState } from 'react';

import { deleteAccount, logout } from 'external/firebase/controllers/auth';

import { updateUserDefaultCurrency, updateUserRemindersPreference } from 'external/firebase/controllers/db';
import useAuth from 'hooks/useAuth';

const Profile: React.FC = () => {
    const { profile } = useAuth();

    const [presentAlert] = useIonAlert();
    const [defaultCurrency, setDefaultCurrency] = useState(profile?.defaultCurrency || 'eur');
    const [areRemindersAllowed, setAreRemindersAllowed] = useState(profile?.areRemindersAllowed || false);

    const handleLogout = () => {
        logout();
    };

    const handleDeleteAccount = () => {
        deleteAccount();
    };

    useEffect(() => {
        updateUserDefaultCurrency(defaultCurrency);
    }, [defaultCurrency]);

    useEffect(() => {
        updateUserRemindersPreference(areRemindersAllowed);
    }, [areRemindersAllowed]);

    return (
        <IonPage>
            <IonHeader>
                <IonRow>
                    <IonCol size='12' className='ion-padding-vertical ion-text-center'>
                        <IonCardTitle>Profile</IonCardTitle>
                    </IonCol>
                </IonRow>
            </IonHeader>
            <IonContent fullscreen>
                <IonGrid class='ion-padding'>
                    <IonRow class='ion-align-items-center'>
                        <IonCol>
                            <IonAvatar>
                                <img src='https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon' />
                            </IonAvatar>
                            <IonTitle>{profile?.displayName}</IonTitle>
                        </IonCol>
                    </IonRow>
                </IonGrid>
                <IonList class='ion-padding ion-padding-top ion-margin-top'>
                    <IonListHeader>
                        <IonLabel>Account</IonLabel>
                    </IonListHeader>
                    <IonItem lines='none' class='ion-margin-vertical' routerLink='/editProfile'>
                        <IonLabel>Edit profile</IonLabel>
                    </IonItem>
                    <IonItem
                        lines='none'
                        class='ion-margin-vertical'
                        button
                        onClick={() =>
                            presentAlert({
                                header: 'Are you sure you want to delete your account?',
                                buttons: [
                                    {
                                        text: 'Cancel',
                                        role: 'cancel',
                                    },
                                    {
                                        text: 'Delete',
                                        role: 'confirm',
                                        handler: handleDeleteAccount,
                                    },
                                ],
                            })
                        }
                    >
                        <IonLabel>Delete account</IonLabel>
                    </IonItem>
                    <IonItem lines='none' class='ion-margin-vertical' button onClick={handleLogout}>
                        <IonLabel>Log out</IonLabel>
                    </IonItem>
                </IonList>
                <IonList class='ion-padding ion-padding-top ion-margin-top'>
                    <IonListHeader>
                        <IonLabel>Settings</IonLabel>
                    </IonListHeader>
                    <IonItem lines='none' class='ion-margin-vertical'>
                        <IonLabel>Default currency</IonLabel>
                        <IonSelect
                            interface='popover'
                            slot='end'
                            value={defaultCurrency}
                            onIonChange={e => setDefaultCurrency(e.target.value)}
                        >
                            <IonSelectOption value='eur'>EUR</IonSelectOption>
                            <IonSelectOption value='usd'>USD</IonSelectOption>
                            <IonSelectOption value='gbp'>GBP</IonSelectOption>
                            <IonSelectOption value='aud'>AUD</IonSelectOption>
                            <IonSelectOption value='cad'>CAD</IonSelectOption>
                            <IonSelectOption value='jpy'>JPY</IonSelectOption>
                        </IonSelect>
                    </IonItem>
                    <IonItem lines='none' class='ion-margin-vertical'>
                        <IonLabel>Reminders</IonLabel>
                        <IonToggle
                            checked={areRemindersAllowed}
                            onIonChange={e => setAreRemindersAllowed(e.target.checked)}
                        />
                    </IonItem>
                </IonList>
                <IonList class='ion-padding ion-padding-top ion-margin-top'>
                    <IonListHeader>
                        <IonLabel>Help</IonLabel>
                    </IonListHeader>
                    <IonItem lines='none' class='ion-margin-vertical' href='https://en.wikipedia.org/wiki/Help!'>
                        <IonLabel>Contact support</IonLabel>
                    </IonItem>
                    <IonItem
                        lines='none'
                        class='ion-margin-vertical'
                        href='https://en.wikipedia.org/wiki/Terms_of_service'
                    >
                        <IonLabel>Terms and conditions</IonLabel>
                    </IonItem>
                </IonList>
            </IonContent>
        </IonPage>
    );
};

export default Profile;
