import {
    IonBackButton,
    IonButtons,
    IonCardTitle,
    IonCol,
    IonContent,
    IonFab,
    IonFabButton,
    IonGrid,
    IonHeader,
    IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonPage,
    IonRow,
    IonSegment,
    IonSegmentButton,
    IonToolbar,
    useIonActionSheet,
    useIonAlert,
    useIonToast,
} from '@ionic/react';
import { DocumentData } from 'firebase/firestore';
import { add, arrowBack } from 'ionicons/icons';
import React, { useEffect, useState } from 'react';

import { useHistory } from 'react-router';

import { deleteCategory, getCategoriesByType } from 'external/firebase/controllers/db';

const Categories = () => {
    const history = useHistory();
    const [present] = useIonActionSheet();
    const [presentAlert] = useIonAlert();
    const [presentToast] = useIonToast();
    const [categories, setCategories] = useState<DocumentData>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [transactionType, setTransactionType] = useState('expense');

    const fetchCategories = async () => {
        const resCategories = await getCategoriesByType(transactionType);
        setCategories(resCategories);
        setIsLoading(false);
    };

    const handleDeleteCategory = async (categoryId: string) => {
        const res = await deleteCategory(categoryId);
        if (!res.ok) {
            presentToast({
                message: res.message,
                color: 'danger',
                duration: 4000,
            });
        } else {
            fetchCategories();
            presentToast({
                message: res?.message,
                color: 'success',
                duration: 2000,
            });
        }
    };

    const openActionSheet = (categoryId: string, categoryName: string) => {
        present(
            [
                {
                    text: 'Edit',
                    handler: () => history.push(`/manageCategory/${categoryId}`),
                },
                {
                    text: 'Delete',
                    role: 'desctructive',
                    handler: async () => {
                        await presentAlert({
                            header: `Are you sure you want to delete ${categoryName} category?`,
                            buttons: [
                                {
                                    text: 'Cancel',
                                    role: 'cancel',
                                },
                                {
                                    text: 'Delete',
                                    role: 'confirm',
                                    handler: () => handleDeleteCategory(categoryId),
                                },
                            ],
                        });
                    },
                },
                { text: 'Cancel', role: 'cancel' },
            ],
            categoryName,
        );
    };

    useEffect(() => {
        fetchCategories();
    }, [transactionType]);

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
                            <IonCardTitle>Categories</IonCardTitle>
                        </IonCol>
                    </IonRow>
                    <IonRow class='ion-padding'>
                        <IonSegment
                            value={transactionType}
                            onIonChange={e => setTransactionType(e.detail.value as string)}
                        >
                            <IonSegmentButton value='income'>
                                <IonLabel>Income</IonLabel>
                            </IonSegmentButton>
                            <IonSegmentButton value='expense'>
                                <IonLabel>Expense</IonLabel>
                            </IonSegmentButton>
                        </IonSegment>
                    </IonRow>
                </IonGrid>
                <IonList class='ion-padding ion-padding-top ion-margin-top'>
                    {!isLoading &&
                        (categories.length > 0 ? (
                            categories.map(category => (
                                <IonItem
                                    key={category.id}
                                    lines='none'
                                    button
                                    onClick={() => openActionSheet(category.id, category.name)}
                                >
                                    <IonLabel>
                                        <h1>{category.name}</h1>
                                    </IonLabel>
                                </IonItem>
                            ))
                        ) : (
                            <IonItem lines='none' class='ion-text-center'>
                                <IonLabel>
                                    <h1>No categories found</h1>
                                </IonLabel>
                            </IonItem>
                        ))}
                </IonList>
                <IonFab vertical='bottom' horizontal='end' slot='fixed'>
                    <IonFabButton routerLink='/manageCategory'>
                        <IonIcon icon={add} />
                    </IonFabButton>
                </IonFab>
            </IonContent>
        </IonPage>
    );
};

export default Categories;
