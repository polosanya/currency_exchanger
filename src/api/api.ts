const BASE_URL = 'https://bank.gov.ua/NBUStatService/v1/statdirectory/exchangenew?json';

export async function getData() {
    const response = await fetch(BASE_URL);
    const data = await response.json();

    return data;
  }
