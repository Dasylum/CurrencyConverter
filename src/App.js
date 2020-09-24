import React, { useState, useEffect } from 'react';
import 'whatwg-fetch';
import './App.css';

//Convert to component
const ToComponent = (props) => {
  return (
    <div>
      <input type="text" value={props.amount} onChange={props.setAmount}/>
      <select value={props.convertTo} onChange={(e) => props.onChange(e)}>
        {props.currencyData.map((value, key) => {
          return(
            <option key={key} value={value}>
              {value}
            </option>
          )
        })}
      </select>
    </div>
  )    
}


//Convert from component
const FromComponent = (props) => {
  return (
    <div>
      <input type="text" value={props.amount} onChange={props.setAmount}/>
      <select value={props.convertFrom} onChange={(e) => props.onChange(e)}>
        {props.currencyData.map((value, key) => {
          return(
            <option key={key} value={value}>
              {value}
            </option>
          )
        })}
      </select>
    </div>
  )  
}

const App = () => {

  const [currencyData, SetCurrencyData] = useState([]); //To populate the options 
  const [amount, SetAmount] = useState(1); //To update the amounts of both to and from
  const [convertFrom, SetconvertFrom] = useState(); //Convert to currency
  const [convertTo, SetconvertTo] = useState(); //Convert from currency
  const [rate, SetRate] = useState(); //Exchange rate
  const [change, SetChange] = useState(false); //To find out which input has changed

  function getCurrentData() {
    fetch('https://api.ratesapi.io/api/latest')
    .then(response => response.json())
    .then(response => {
      SetconvertTo(response.base);
      SetconvertFrom(Object.keys(response.rates)[0]);
      SetCurrencyData([response.base, ...Object.keys(response.rates)])
    })
  }

  //Loads the data once when the application runs
  useEffect(() => {
    getCurrentData();
  }, []);

  //Gets latest exchange rates when the currency changes
  useEffect(() => {
    if (convertFrom && convertTo) {
      getLatestRates();
    }
  }, [convertFrom, convertTo])

  function getLatestRates() {
    if(convertFrom!=null && convertTo!=null) {
      fetch(`https://api.ratesapi.io/api/latest?base=${convertFrom}&symbols=${convertTo}`)
      .then(response => response.json())
      .then(response => SetRate(response.rates[convertTo]));
    }
  }

  //Finds out the converted amount 
  let fromAmount, toAmount;
  if(change) {
    toAmount = amount
    fromAmount = toAmount * rate;
  }
  else {
    fromAmount = amount;
    toAmount = amount / rate;
  }

  function handlefromAmount(e) {
    SetAmount(e.target.value);
    SetChange(false);
  }

  function handletoAmount(e) {
    SetAmount(e.target.value);
    SetChange(true);
  }

  //Component
  return (
    <div>
      <h1>Currency Converter</h1>

      <FromComponent currencyData={currencyData} 
      onChange={(e) => SetconvertFrom(e.target.value)}
      convertFrom={convertFrom}
      amount={fromAmount}
      setAmount={handlefromAmount}/>

      <ToComponent currencyData={currencyData} 
      onChange={(e) => SetconvertTo(e.target.value)}
      convertTo={convertTo} amount={toAmount}
      setAmount={handletoAmount}/>
    </div>
  )   
}

export default App;
