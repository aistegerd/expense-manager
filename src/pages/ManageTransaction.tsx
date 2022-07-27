import {
    IonBackButton,
    IonButton,
    IonButtons,
    IonCardTitle,
    IonCol,
    IonContent,
    IonDatetime,
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
    IonSelect,
    IonSelectOption,
    IonTextarea,
    IonToolbar,
    useIonToast,
} from '@ionic/react';
import { DocumentData } from 'firebase/firestore';
import { arrowBack } from 'ionicons/icons';
import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import {
    addTransaction,
    getCategoriesByType,
    getTransactionById,
    updateTransaction,
} from 'external/firebase/controllers/db';
import useAuth from 'hooks/useAuth';

import styles from './ManageTransaction.module.scss';

const ManageTransaction = () => {
    const history = useHistory();
    const location = useLocation();

    const { profile } = useAuth();
    const [presentToast] = useIonToast();
    const [isSubmitting, setSubmitting] = useState(false);

    const id = location.pathname.split('/')[2];
    const isEdit = !!id;

    const [categories, setCategories] = useState<DocumentData>([]);

    // form fields
    const [transactionType, setTransactionType] = useState<string>('expense');
    const [transactionDate, setTransactionDate] = useState<string>();
    const [transactionTitle, setTransactionTitle] = useState<string | undefined>();
    const [transactionAmount, setTransactionAmount] = useState<number | undefined>();
    const [transactionCurrency, setTransactionCurrency] = useState<string>(profile?.currency || 'eur');
    const [transactionCategory, setTransactionCategory] = useState<string | undefined>();
    const [transactionNote, setTransactionNote] = useState<string | undefined>();

    const fetchCategories = async (transactionType: string) => {
        const res = await getCategoriesByType(transactionType);
        setCategories(res);
    };

    const fetchTransaction = async (id: string) => {
        const res: DocumentData = await getTransactionById(id);
        setTransactionType(res.isIncome ? 'income' : 'expense');
        const date = new Date(res.date.seconds * 1000);
        const dateStr = `${date.toISOString().slice(0, -5)}Z`;
        setTransactionDate(dateStr);
        setTransactionTitle(res.title);
        setTransactionAmount(res.amount);
        setTransactionCurrency(res.currency);
        setTransactionCategory(res.category);
        setTransactionNote(res.note);
    };

    const handleSubmit = async () => {
        if (transactionAmount && transactionCategory && transactionDate && transactionTitle) {
            setSubmitting(true);
            const res = isEdit
                ? await updateTransaction(
                      id,
                      transactionAmount,
                      transactionCategory,
                      transactionCurrency,
                      new Date(transactionDate),
                      transactionType === 'income',
                      transactionNote || '',
                      transactionTitle,
                  )
                : await addTransaction(
                      transactionAmount,
                      transactionCategory,
                      transactionCurrency,
                      new Date(transactionDate),
                      transactionType === 'income',
                      transactionNote || '',
                      transactionTitle,
                  );
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
                history.push('/dashboard');
            }
        }
    };

    useEffect(() => {
        if (transactionType) {
            fetchCategories(transactionType);
        }
    }, [transactionType]);

    useEffect(() => {
        if (isEdit && id) {
            fetchTransaction(id);
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
                            <IonCardTitle>{isEdit ? 'Edit transaction' : 'Add transaction'}</IonCardTitle>
                        </IonCol>
                    </IonRow>
                    <IonSegment value={transactionType} onIonChange={e => setTransactionType(e.detail.value as string)}>
                        <IonSegmentButton value='income'>
                            <IonLabel>Income</IonLabel>
                        </IonSegmentButton>
                        <IonSegmentButton value='expense'>
                            <IonLabel>Expense</IonLabel>
                        </IonSegmentButton>
                    </IonSegment>
                    <IonRow className='ion-margin-top ion-padding-top'>
                        <IonCol size='12'>
                            <IonDatetime
                                presentation='date-time'
                                value={transactionDate}
                                firstDayOfWeek={1}
                                onIonChange={e => setTransactionDate(e.target.value as string)}
                            >
                                <span slot='title'>Select transaction date</span>
                            </IonDatetime>

                            <IonItem className='ion-margin-vertical'>
                                <IonLabel position='stacked'>Title</IonLabel>
                                <IonInput
                                    placeholder='Enter title'
                                    value={transactionTitle}
                                    onIonChange={e => setTransactionTitle(e.target.value as string | undefined)}
                                    required
                                ></IonInput>
                            </IonItem>

                            <IonItem className='ion-margin-vertical ion-just'>
                                <IonLabel position='stacked'>Amount</IonLabel>
                                <IonInput
                                    type='number'
                                    placeholder='Enter amount'
                                    value={transactionAmount}
                                    onIonChange={e => setTransactionAmount(parseFloat(e.target.value as string))}
                                    required
                                ></IonInput>
                            </IonItem>

                            <IonItem className='ion-margin-vertical'>
                                <IonLabel position='stacked'>Currency</IonLabel>
                                <IonSelect
                                    interface='popover'
                                    value={transactionCurrency}
                                    onIonChange={e => setTransactionCurrency(e.target.value)}
                                >
                                    <IonSelectOption value='eur'>EUR</IonSelectOption>
                                    <IonSelectOption value='usd'>USD</IonSelectOption>
                                    <IonSelectOption value='gbp'>GBP</IonSelectOption>
                                    <IonSelectOption value='aud'>AUD</IonSelectOption>
                                    <IonSelectOption value='cad'>CAD</IonSelectOption>
                                    <IonSelectOption value='jpy'>JPY</IonSelectOption>
                                </IonSelect>
                            </IonItem>

                            <IonItem className='ion-margin-vertical'>
                                <IonLabel
                                    position='stacked'
                                    className={`${styles.dFlex} ion-align-items-center ion-justify-content-between`}
                                >
                                    Category
                                    <IonButton fill='outline' routerLink='/categories'>
                                        Manage Categories
                                    </IonButton>
                                </IonLabel>
                                <IonSelect
                                    interface='popover'
                                    placeholder='Select category'
                                    value={transactionCategory}
                                    onIonChange={e => setTransactionCategory(e.target.value)}
                                >
                                    {categories.map(category => (
                                        <IonSelectOption key={category.id} value={category.id}>
                                            {category.name}
                                        </IonSelectOption>
                                    ))}
                                </IonSelect>
                            </IonItem>

                            <IonItem className='ion-margin-vertical'>
                                <IonLabel position='stacked'>Note</IonLabel>
                                <IonTextarea
                                    value={transactionNote}
                                    onIonChange={e => setTransactionNote(e.detail.value!)}
                                ></IonTextarea>
                            </IonItem>

                            <IonButton expand='block' onClick={handleSubmit}>
                                {isEdit ? 'Update transaction' : 'Add new transactions'}
                            </IonButton>
                            <IonLoading
                                isOpen={isSubmitting}
                                onDidDismiss={() => setSubmitting(false)}
                                message={isEdit ? 'Editing transaction...' : 'Adding new transaction...'}
                            />
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </IonContent>
        </IonPage>
    );
};

export default ManageTransaction;
