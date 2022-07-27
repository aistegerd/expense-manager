import { API_KEY, BASE_URL } from 'external/apilayer/config';

export const getExchangeRate = async (base: string, date: string, target: string) => {
    const myHeaders = new Headers();
    myHeaders.append('apikey', API_KEY);

    try {
        const response = await fetch(`${BASE_URL}/${date}?symbols=${target}&base=${base}`, {
            method: 'GET',
            redirect: 'follow',
            headers: myHeaders,
        });
        const result = await response.json();
        return result?.rates[target.toUpperCase()];
    } catch (error) {
        return { error };
    }
};
