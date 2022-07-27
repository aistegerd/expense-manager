import {
    IonBackButton,
    IonButton,
    IonButtons,
    IonCardTitle,
    IonCol,
    IonContent,
    IonFooter,
    IonGrid,
    IonHeader,
    IonLoading,
    IonPage,
    IonRow,
    IonToolbar,
    useIonToast,
} from '@ionic/react';
import { arrowBack } from 'ionicons/icons';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';

import { ActionLink } from 'components/ActionLink';
import CustomField from 'components/CustomField';
import { login } from 'external/firebase/controllers/auth';
import { useLoginFields } from 'utils/forms/fields';
import { validateForm } from 'utils/forms/utils';

const Login = () => {
    const params = useParams();
    const fields = useLoginFields();
    const [presentToast] = useIonToast();
    const [errors, setErrors] = useState(false);
    const [isSubmitting, setSubmitting] = useState(false);

    const resetForm = () => {
        fields.forEach(field => field.input.state.reset(''));
        setErrors(false);
    };

    const handleLogin = async () => {
        const errors = validateForm(fields);
        // @ts-ignore
        setErrors(errors);

        if (!errors.length) {
            const res = await login(fields[0].input.state.value, fields[1].input.state.value);
            setSubmitting(false);
            if (!res.ok) {
                resetForm();
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
        }
    };

    useEffect(() => {
        return () => {
            resetForm();
        };
    }, [params]);

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
                        <IonCol size='12' className='ion-padding-top ion-text-center'>
                            <IonCardTitle>Welcome back</IonCardTitle>
                        </IonCol>
                    </IonRow>
                    <IonRow className='ion-margin-top ion-padding-top'>
                        <IonCol size='12'>
                            {fields.map(field => {
                                return <CustomField key={field.id} field={field} errors={errors} />;
                            })}
                            <IonButton expand='block' onClick={handleLogin}>
                                Sign In
                            </IonButton>
                            <IonLoading
                                isOpen={isSubmitting}
                                onDidDismiss={() => setSubmitting(false)}
                                message={'Signing in...'}
                            />
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </IonContent>
            <IonFooter>
                <IonGrid className='ion-no-margin ion-no-padding'>
                    <ActionLink message="Don't have an account?" text='Sign Up' link='/register' />
                </IonGrid>
            </IonFooter>
        </IonPage>
    );
};

export default Login;
