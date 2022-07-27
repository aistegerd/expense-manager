import { IonCol, IonRouterLink, IonRow, IonText } from '@ionic/react';
import React from 'react';

export const ActionLink = props => (
    <IonRow className='ion-padding ion-justify-content-center'>
        <IonCol size='12'>
            <IonText color='secondary'>
                {props.message}{' '}
                <IonRouterLink className='custom-link' routerLink={props.link}>
                    {props.text} &rarr;
                </IonRouterLink>
            </IonText>
        </IonCol>
    </IonRow>
);
