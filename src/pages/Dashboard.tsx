import {
    IonButton,
    IonCardTitle,
    IonCol,
    IonContent,
    IonFab,
    IonFabButton,
    IonHeader,
    IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonListHeader,
    IonNote,
    IonPage,
    IonRow,
} from '@ionic/react';
import { DocumentData } from 'firebase/firestore';
import { add } from 'ionicons/icons';
import React, { useEffect, useState } from 'react';

import { getExchangeRate } from 'external/apilayer/controllers/converter';
import { getTransactions } from 'external/firebase/controllers/db';
import useAuth from 'hooks/useAuth';
import { getCurrentWeekStartDate } from 'utils/utils';

const Dashboard: React.FC = () => {
    const { user, profile } = useAuth();

    const [transactions, setTransactions] = useState<DocumentData>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [balance, setBalance] = useState(0);

    const calculateBalance = async transactions => {
        return transactions.reduce(async (acc, transaction) => {
            const defaultCurrency = profile?.defaultCurrency || 'eur';
            let { amount } = transaction;
            if (transaction.currency !== defaultCurrency) {
                const date = new Date(transaction.date.seconds * 1000);
                const dateStr = date.toISOString().split('T')[0];
                const rate = await getExchangeRate(defaultCurrency, dateStr, transaction.currency);
                amount = rate * transaction.amount;
            }
            return transaction.isIncome ? acc + amount : acc - amount;
        }, 0);
    };

    const fetchTransactions = async userUid => {
        const resTransactions = await getTransactions(userUid, getCurrentWeekStartDate());
        setTransactions(resTransactions);
        const convertedBalance = await calculateBalance(resTransactions);
        setBalance(convertedBalance);
        setIsLoading(false);
    };

    useEffect(() => {
        if (user?.uid) {
            fetchTransactions(user.uid);
        }
    }, [user?.uid]);

    return (
        <IonPage>
            <IonHeader>
                <IonRow>
                    <IonCol size='12' className='ion-padding-vertical ion-text-center'>
                        <IonCardTitle>Dashboard</IonCardTitle>
                    </IonCol>
                </IonRow>
            </IonHeader>
            <IonContent fullscreen>
                <div className='ion-text-center ion-padding-top ion-margin-top'>
                    This week's balance
                    <h1>
                        {!isLoading &&
                            balance.toLocaleString('en-GB', {
                                style: 'currency',
                                currency: profile?.defaultCurrency || 'eur',
                            })}
                    </h1>
                </div>
                <IonList class='ion-padding ion-padding-top ion-margin-top'>
                    <IonListHeader>
                        <IonLabel>Transactions</IonLabel>
                        <IonButton fill='outline' size='small' routerLink='/transactions'>
                            See All
                        </IonButton>
                    </IonListHeader>
                    {!isLoading &&
                        (transactions.length > 0 ? (
                            transactions.map(transaction => (
                                <IonItem key={transaction.id} lines='none'>
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
                <IonFab vertical='bottom' horizontal='end' slot='fixed'>
                    <IonFabButton routerLink='/manageTransaction'>
                        <IonIcon icon={add} />
                    </IonFabButton>
                </IonFab>
            </IonContent>
        </IonPage>
    );
};

export default Dashboard;
