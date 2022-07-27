import {
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
    IonSegment,
    IonSegmentButton,
    IonSelect,
    IonSelectOption,
} from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { Cell, Pie, PieChart } from 'recharts';

import { getExchangeRate } from 'external/apilayer/controllers/converter';
import { getTransactions } from 'external/firebase/controllers/db';
import useAuth from 'hooks/useAuth';
import { getNMonthsAgoDate } from 'utils/utils';

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text x={x} y={y} fill='black' textAnchor={x > cx ? 'start' : 'end'} dominantBaseline='central'>
            {`${(percent * 100).toFixed(1)}%`}
        </text>
    );
};

const Statistics: React.FC = () => {
    const { user, profile } = useAuth();

    const [isLoading, setIsLoading] = useState(true);
    const [transactionType, setTransactionType] = useState('expense');
    const [timePeriodInMonths, setTimePeriodInMonths] = useState('1');
    const [transactionsByCategory, setTransactionsByCategory] = useState({});
    const [data, setData] = useState([]);

    const calculateBalanceByCategory = res => {
        return res.reduce(async (acc, transaction) => {
            const defaultCurrency = profile?.defaultCurrency || 'eur';
            let { amount } = transaction;
            if (transaction.currency !== defaultCurrency) {
                const date = new Date(transaction.date.seconds * 1000);
                const dateStr = date.toISOString().split('T')[0];
                const rate = await getExchangeRate(defaultCurrency, dateStr, transaction.currency);
                amount = rate * transaction.amount;
            }
            acc[transaction.category] =
                transaction.category in acc
                    ? {
                          ...acc[transaction.category],
                          amount: acc[transaction.category].amount + amount,
                      }
                    : { amount, color: transaction.color, isIncome: transaction.isIncome };
            return acc;
        }, {});
    };

    const fetchTransactions = async (userUid: string, timePeriodInMonths: number) => {
        const res = await getTransactions(
            userUid,
            timePeriodInMonths !== 0 ? getNMonthsAgoDate(timePeriodInMonths) : undefined,
            transactionType,
        );
        if (!('error' in res)) {
            const convertedTransactionsByCategory = await calculateBalanceByCategory(res);
            setTransactionsByCategory(convertedTransactionsByCategory);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        if (user?.uid && timePeriodInMonths && transactionType) {
            fetchTransactions(user.uid, Number(timePeriodInMonths));
        }
    }, [user?.uid, timePeriodInMonths, transactionType]);

    useEffect(() => {
        const transactionsByCategoryChartData = [];
        Object.keys(transactionsByCategory).forEach(key => {
            // @ts-ignore
            transactionsByCategoryChartData.push({ name: key, value: transactionsByCategory[key].amount });
        });
        setData(transactionsByCategoryChartData);
    }, [transactionsByCategory]);

    // @ts-ignore
    return (
        <IonPage>
            <IonHeader>
                <IonRow>
                    <IonCol size='12' className='ion-padding-vertical ion-text-center'>
                        <IonCardTitle>Statistics</IonCardTitle>
                    </IonCol>
                </IonRow>
            </IonHeader>
            <IonContent fullscreen>
                <IonGrid class='ion-padding'>
                    <IonRow class='ion-align-items-center'>
                        <IonCol>
                            <IonSelect
                                interface='popover'
                                value={timePeriodInMonths}
                                onIonChange={e => setTimePeriodInMonths(e.target.value)}
                            >
                                <IonSelectOption value='1'>This month</IonSelectOption>
                                <IonSelectOption value='3'>Last 3 months</IonSelectOption>
                                <IonSelectOption value='6'>Last 6 months</IonSelectOption>
                                <IonSelectOption value='12'>One year</IonSelectOption>
                                <IonSelectOption value='24'>Two year</IonSelectOption>
                                <IonSelectOption value='0'>All time</IonSelectOption>
                            </IonSelect>
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
                <IonGrid>
                    <IonRow class='ion-justify-content-center'>
                        <PieChart width={400} height={400}>
                            {/* @ts-ignore */}
                            <Pie
                                data={data}
                                cx='50%'
                                cy='50%'
                                labelLine={false}
                                label={renderCustomizedLabel}
                                outerRadius={80}
                                fill='#8884d8'
                                dataKey='value'
                            >
                                {data.map((entry, index) => (
                                    // @ts-ignore
                                    <Cell key={`cell-${index}`} fill={transactionsByCategory[entry?.name]?.color} />
                                ))}
                            </Pie>
                        </PieChart>
                    </IonRow>
                </IonGrid>
                <IonList class='ion-padding'>
                    <IonListHeader>
                        <IonLabel>Balance by categories</IonLabel>
                    </IonListHeader>
                    {!isLoading &&
                        (Object.keys(transactionsByCategory).length > 0 ? (
                            Object.keys(transactionsByCategory).map(key => (
                                <IonItem key={key} lines='none'>
                                    <IonLabel
                                        style={{
                                            color: transactionsByCategory[key].color,
                                        }}
                                    >
                                        <h1>{key}</h1>
                                    </IonLabel>
                                    <IonNote
                                        slot='end'
                                        color={transactionsByCategory[key].isIncome ? 'success' : 'danger'}
                                    >
                                        <h3>
                                            {transactionsByCategory[key].isIncome ? '+' : '-'}{' '}
                                            {transactionsByCategory[key].amount.toLocaleString('en-GB', {
                                                style: 'currency',
                                                currency: profile?.defaultCurrency || 'eur',
                                            })}
                                        </h3>
                                    </IonNote>
                                </IonItem>
                            ))
                        ) : (
                            <IonItem lines='none' class='ion-text-center'>
                                <IonLabel>
                                    <h1>No {transactionType} transactions found in selected period</h1>
                                </IonLabel>
                            </IonItem>
                        ))}
                </IonList>
            </IonContent>
        </IonPage>
    );
};

export default Statistics;
