import { IonCol, IonGrid, IonImg, IonPage, IonRow, IonSpinner } from '@ionic/react';
import React from 'react';

import logo from 'assets/piggy-bank.svg';

const LoadingScreen = () => (
    <IonPage>
        <IonGrid className='ion-padding'>
            <IonRow class='ion-align-items-cente ion-justify-content-center'>
                <IonCol size='24'>
                    <IonImg src={logo} />
                </IonCol>
            </IonRow>
            <IonRow class='ion-justify-content-center'>
                <IonCol class=' ion-padding ion-text-center ion-justify-content-center' size='4'>
                    <IonSpinner color='primary' />
                </IonCol>
            </IonRow>
        </IonGrid>
    </IonPage>
);

export default LoadingScreen;
