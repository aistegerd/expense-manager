import {
    IonButton,
    IonCardSubtitle,
    IonCardTitle,
    IonCol,
    IonContent,
    IonGrid,
    IonImg,
    IonPage,
    IonRouterLink,
    IonRow,
} from '@ionic/react';

import React from 'react';

import logo from 'assets/piggy-bank.svg';

import styles from './Home.module.scss';

const Home = () => {
    return (
        <IonPage>
            <IonContent fullscreen>
                <div className={styles.getStarted}>
                    <IonGrid className={`ion-padding ${styles.logoContainer}`}>
                        <IonRow class='ion-align-items-cente ion-justify-content-center'>
                            <IonCol size='6'>
                                <IonImg src={logo} />
                            </IonCol>
                        </IonRow>
                    </IonGrid>
                    <IonGrid>
                        <IonRow className={`ion-text-center ion-justify-content-center ${styles.headingContainer}`}>
                            <IonCol size='11' className={styles.headingText}>
                                <IonCardTitle>Hello!</IonCardTitle>
                                <IonCardSubtitle>Help yourself to manage your money easier</IonCardSubtitle>
                            </IonCol>
                        </IonRow>
                        <IonRow className={`ion-text-center ion-justify-content-center ${styles.authButtonsContainer}`}>
                            <IonCol size='6'>
                                <IonRouterLink routerLink='/register'>
                                    <IonButton className={styles.authButton}>Sign Up</IonButton>
                                </IonRouterLink>
                            </IonCol>
                            <IonCol size='6'>
                                <IonRouterLink routerLink='/login'>
                                    <IonButton className={styles.authButton} fill='outline'>
                                        Sign In
                                    </IonButton>
                                </IonRouterLink>
                            </IonCol>
                        </IonRow>
                    </IonGrid>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Home;
