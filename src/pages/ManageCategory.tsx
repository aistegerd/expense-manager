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
    IonSegment,
    IonSegmentButton,
    IonToolbar,
    useIonToast,
} from '@ionic/react';
import { arrowBack } from 'ionicons/icons';
import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import { addCategory, getCategoryById, updateCategory } from 'external/firebase/controllers/db';

const ManageCategory = () => {
    // @ts-ignore
    const location = useLocation();
    const history = useHistory();
    const [presentToast] = useIonToast();
    const [isSubmitting, setSubmitting] = useState(false);

    const id = location.pathname.split('/')[2];
    const isEdit = !!id;

    // form fields
    const [categoryType, setCategoryType] = useState<string>('expense');
    const [categoryName, setCategoryName] = useState<string | undefined>();
    const [categoryColor, setCategoryColor] = useState<string | undefined>();

    const fetchCategory = async (id: string) => {
        const res = await getCategoryById(id);
        setCategoryType(res.isIncomeCategory ? 'income' : 'expense');
        setCategoryName(res.name);
        setCategoryColor(res.color);
    };

    const handleSubmit = async () => {
        if (categoryName && categoryColor) {
            setSubmitting(true);
            const res = isEdit
                ? await updateCategory(id, categoryType === 'income', categoryName, categoryColor)
                : await addCategory(categoryType === 'income', categoryName, categoryColor);
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
                history.push('/categories');
            }
        }
    };

    useEffect(() => {
        if (isEdit && id) {
            fetchCategory(id);
        }
    }, [isEdit, id]);

    // @ts-ignore
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
                            <IonCardTitle>Add category</IonCardTitle>
                        </IonCol>
                    </IonRow>
                    <IonSegment value={categoryType} onIonChange={e => setCategoryType(e.detail.value as string)}>
                        <IonSegmentButton value='income'>
                            <IonLabel>Income</IonLabel>
                        </IonSegmentButton>
                        <IonSegmentButton value='expense'>
                            <IonLabel>Expense</IonLabel>
                        </IonSegmentButton>
                    </IonSegment>
                    <IonRow className='ion-margin-top ion-padding-top'>
                        <IonCol size='12'>
                            <IonItem className='ion-margin-vertical'>
                                <IonLabel position='stacked'>Name</IonLabel>
                                <IonInput
                                    placeholder='Enter name'
                                    value={categoryName}
                                    onIonChange={e => setCategoryName(e.target.value as string)}
                                    required
                                ></IonInput>
                            </IonItem>

                            <IonItem className='ion-margin-vertical'>
                                <IonLabel position='stacked'>Color</IonLabel>
                                <IonInput
                                    placeholder='Enter color'
                                    value={categoryColor}
                                    onIonChange={e => setCategoryColor(e.target.value as string)}
                                    required
                                ></IonInput>
                            </IonItem>

                            <IonButton expand='block' onClick={handleSubmit}>
                                {isEdit ? 'Edit category' : 'Add new category'}
                            </IonButton>
                            <IonLoading
                                isOpen={isSubmitting}
                                onDidDismiss={() => setSubmitting(false)}
                                message={isEdit ? 'Editing category...' : 'Adding new category...'}
                            />
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </IonContent>
        </IonPage>
    );
};

export default ManageCategory;
