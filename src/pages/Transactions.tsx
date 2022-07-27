import {
    IonBackButton,
    IonButtons,
    IonCardTitle,
    IonCol,
    IonContent,
    IonGrid,
    IonHeader,
    IonItem,
    IonLabel,
    IonList,
    IonListHeader,
    IonNote,
    IonPage,
    IonRow,
    IonToolbar,
    useIonActionSheet,
    useIonAlert,
    useIonToast,
} from '@ionic/react';
import { DocumentData } from 'firebase/firestore';
import { arrowBack } from 'ionicons/icons';
import React, { useEffect, useState } from 'react';

import { useHistory } from 'react-router';

import { deleteTransaction, getTransactions } from 'external/firebase/controllers/db';
import useAuth from 'hooks/useAuth';

const Transactions = () => {
    const history = useHistory();
    const [present] = useIonActionSheet();
    const [presentAlert] = useIonAlert();
    const [presentToast] = useIonToast();
    const { user } = useAuth();
    const [transactions, setTransactions] = useState<DocumentData>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchTransactions = async () => {
        if (user?.uid) {
            const resTransactions = await getTransactions(user.uid);
            setTransactions(resTransactions);
            setIsLoading(false);
        }
    };

    const handleDeleteTransaction = async (transactionId: string) => {
        const res = await deleteTransaction(transactionId);
        if (!res.ok) {
            presentToast({
                message: res.message,
                color: 'danger',
                duration: 4000,
            });
        } else {
            fetchTransactions();
            presentToast({
                message: res?.message,
                color: 'success',
                duration: 2000,
            });
        }
    };

    const openActionSheet = (transactionId: string, transactionTitle: string) => {
        present(
            [
                {
                    text: 'Edit',
                    handler: () => history.push(`/manageTransaction/${transactionId}`),
                },
                {
                    text: 'Delete',
                    role: 'desctructive',
                    handler: async () => {
                        await presentAlert({
                            header: `Are you sure you want to delete ${transactionTitle} transaction?`,
                            buttons: [
                                {
                                    text: 'Cancel',
                                    role: 'cancel',
                                },
                                {
                                    text: 'Delete',
                                    role: 'confirm',
                                    handler: () => handleDeleteTransaction(transactionId),
                                },
                            ],
                        });
                    },
                },
                { text: 'Cancel', role: 'cancel' },
            ],
            transactionTitle,
        );
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

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
                            <IonCardTitle>All transactions</IonCardTitle>
                        </IonCol>
                    </IonRow>
                </IonGrid>
                <IonList class='ion-padding ion-padding-top ion-margin-top'>
                    <IonListHeader>
                        <IonLabel>Transactions</IonLabel>
                    </IonListHeader>
                    {!isLoading &&
                        (transactions.length > 0 ? (
                            transactions.map(transaction => (
                                <IonItem
                                    key={transaction.id}
                                    lines='none'
                                    onClick={() => openActionSheet(transaction.id, transaction.title)}
                                >
                                    <IonLabel>
                                        <h1>{transaction.title}</h1>
                                        <p>{transaction.category}</p>
                                    </IonLabel>
                                    <IonNote slot='end' color={transaction.isIncome ? 'success' : 'danger'}>
                                        <h3>
                                            {transaction.isIncome ? '+' : '-'}{' '}
                                            {transaction.amount.toLocaleString('en-GB', {
                                                style: 'currency',
                                                currency: transaction.currency,
                                            })}
                                        </h3>
                                    </IonNote>
                                </IonItem>
                            ))
                        ) : (
                            <IonItem lines='none' class='ion-text-center'>
                                <IonLabel>
                                    <h1>No transactions found</h1>
                                </IonLabel>
                            </IonItem>
                        ))}
                </IonList>
            </IonContent>
        </IonPage>
    );
};

export default Transactions;
