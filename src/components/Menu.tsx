import { IonContent, IonHeader, IonItem, IonList, IonMenu, IonToolbar } from '@ionic/react';
import React from 'react';

const Menu = () => {
    return (
        <IonMenu side='start' menuId='first'>
            <IonHeader>
                <IonToolbar color='primary'></IonToolbar>
            </IonHeader>
            <IonContent>
                <IonList>
                    <IonItem>Change Photo</IonItem>
                    <IonItem>Menu Item</IonItem>
                    <IonItem>Menu Item</IonItem>
                    <IonItem>Menu Item</IonItem>
                    <IonItem>Menu Item</IonItem>
                </IonList>
            </IonContent>
        </IonMenu>
    );
};

export default Menu;
