import React, { useEffect, useState } from 'react';
import { getData } from './api/api';
import './App.scss';
import arrow from './images/arrow.svg';

interface Data {
  r030: number;
  txt: string;
  rate: number;
  cc: string;
  exchangedate: string;
}

enum Location {
  Left,
  Right
}

function App() {
  const [data, setData] = useState<Data[]>([{
    r030: 0,
    txt: 'Українська гривня',
    rate: 1,
    cc: 'UAH',
    exchangedate: '10.09.2022'
  }]);
  const [leftInput, setleftInput] = useState('');
  const [rightInput, setrightInput] = useState('');
  const [leftOption, setLeftOption] = useState('');
  const [rightOption, setRightOption] = useState('');

  const getDataFromServer = async () => {
    const dataFromServer = await getData();
    dataFromServer.sort((a: Data, b: Data) => a.cc.localeCompare(b.cc))
    setData([...data, ...dataFromServer]);
    setLeftOption(JSON.stringify(data[0]));
    setRightOption(JSON.stringify(data[0]));
  };

  const handleInputChange = (inputLocation: Location, value: string) => {
    const leftRate = JSON.parse(leftOption).rate;
    const rightRate = JSON.parse(rightOption).rate;

    if (inputLocation === Location.Left) {
      setleftInput(value);
      const exchangeRate = (leftRate / rightRate * +value).toFixed(2);

      setrightInput(exchangeRate.toString());
    }

    if (inputLocation === Location.Right) {
      setrightInput(value);

      const exchangeRate = (rightRate / leftRate * +value).toFixed(2);

      setleftInput(exchangeRate.toString());
    }
  };

  const handleOptionChange = (optionLocation: Location, value: string) => {
    if (optionLocation === Location.Left) {
      setLeftOption(value);

      const leftRate = JSON.parse(value).rate;
      const rightRate = JSON.parse(rightOption).rate;

      const exchangeRate = (leftRate / rightRate * +leftInput).toFixed(2);
    
      setrightInput(exchangeRate.toString());
    }

    if (optionLocation === Location.Right) {  
      setRightOption(value);

      const leftRate = JSON.parse(leftOption).rate;
      const rightRate = JSON.parse(value).rate;

      console.log(JSON.parse(leftOption).txt);

      const exchangeRate = (rightRate / leftRate * +rightInput).toFixed(2);

      console.log(leftRate, rightRate, rightInput);
      setleftInput(exchangeRate.toString());
    }
  };

  useEffect(() => {
    getDataFromServer();
  }, []);

  return (
    <div className='App'>
      <header className='App__header'>
        {data.filter(obj => obj.cc === 'USD' || obj.cc === 'EUR').map(obj => (
          <p key={obj.r030}>{obj.cc} = {obj.rate.toFixed(2)} UAH </p>
        ))}
      </header>
      <main className='App__main'>
        <select className='App__select' onChange={(e) => handleOptionChange(Location.Left, e.target.value)}>
          {data.map(obj => (
            <option
              className='App__option'
              key={obj.r030}
              value={JSON.stringify(obj)}
            >
              {obj.cc} {obj.txt}
            </option>
          ))}
        </select>
        <input
          className='App__input'
          placeholder='Введіть суму'
          type='number'
          value={leftInput}
          onChange={(e) => handleInputChange(Location.Left, e.target.value)}
        />

        <img src={arrow} alt='Arrow' className='App__image' />

        <input
          className='App__input'
          placeholder='Введіть суму'
          type='number'
          value={rightInput}
          onChange={(e) => handleInputChange(Location.Right, e.target.value)}
        />
        <select className='App__select' onChange={(e) => handleOptionChange(Location.Right, e.target.value)}>
          {data.map(obj => (
            <option
              className='App__option'
              key={obj.r030}
              value={JSON.stringify(obj)}
            >
              {obj.cc} {obj.txt}
            </option>
          ))}
        </select>
      </main>
    </div>
  );
}

export default App;
