import {
    IonBackButton,
    IonButton,
    IonButtons,
    IonCardTitle,
    IonCol,
    IonContent,
    IonGrid,
    IonHeader,
    IonInput,
    IonItem,
    IonLabel,
    IonLoading,
    IonPage,
    IonRow,
    IonToolbar,
    useIonToast,
} from '@ionic/react';
import { arrowBack } from 'ionicons/icons';
import React, { useState } from 'react';

import { updateUser } from 'external/firebase/controllers/db';
import useAuth from 'hooks/useAuth';

const EditProfile: React.FC = () => {
    const { profile } = useAuth();

    const [presentToast] = useIonToast();
    const [isSubmitting, setSubmitting] = useState(false);
    const [displayName, setDisplayName] = useState(profile?.displayName);

    const handleSubmit = async () => {
        setSubmitting(true);
        const res = await updateUser(displayName, '');
        setSubmitting(false);
        if (!res.ok) {
            presentToast({
                message: res.message,
                color: 'danger',
                duration: 4000,
            });
        } else {
            presentToast({
                message: res?.message,
                color: 'success',
                duration: 2000,
            });
        }
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot='start' className='ion-padding'>
                        <IonBackButton icon={arrowBack} text='' />
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <IonGrid className='ion-padding'>
                    <IonRow>
                        <IonCol size='12' className='ion-padding-vertical ion-text-center'>
                            <IonCardTitle>Edit profile</IonCardTitle>
                        </IonCol>
                    </IonRow>
                    <IonRow className='ion-margin-top ion-padding-top'>
                        <IonCol size='12'>
                            <IonItem className='ion-margin-vertical'>
                                <IonLabel position='stacked'>Your name</IonLabel>
                                <IonInput
                                    placeholder='Enter your name'
                                    value={displayName}
                                    onIonChange={e => setDisplayName(e.target.value)}
                                ></IonInput>
                            </IonItem>
                            <IonButton expand='block' onClick={handleSubmit}>
                                Update profile
                            </IonButton>
                            <IonLoading
                                isOpen={isSubmitting}
                                onDidDismiss={() => setSubmitting(false)}
                                message={'Updating profile new transaction...'}
                            />
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </IonContent>
        </IonPage>
    );
};

export default EditProfile;
