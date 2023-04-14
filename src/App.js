import { useEffect, useState } from "react";
import Block from "./Block";

import "./index.scss";

const url = "https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json";

function App() {
  const [rates, setRates] = useState([]);
  const [exchangeRates, setExchangeRates] = useState({});
  const [fromCurrency, setFromCurrency] = useState("PLN");
  const [toCurrency, setToCurrency] = useState("USD");
  const [fromPrice, setFromPrice] = useState(0);
  const [toPrice, setToPrice] = useState(0);

  useEffect(() => {
    fetch(url)
      .then((response) => response.json())
      .then((json) => {
        setRates(json);
        const convertArrayToObject = (rates) => {
          return rates.reduce((obj, item) => {
            obj[item.cc] = item.rate;
            return obj;
          }, {});
        };
        setExchangeRates(convertArrayToObject(rates));
      })
      .catch((error) => console.log(error));
  }, [rates]);

  const onChangeFromPrice = (value) => {
    const result =
      (exchangeRates[fromCurrency] / exchangeRates[toCurrency]) * value;
    setFromPrice(value);
    setToPrice(result.toFixed(3));
  };

  const onChangeToPrice = (value) => {
    const result =
      (exchangeRates[toCurrency] / exchangeRates[fromCurrency]) * value;
    setFromPrice(result.toFixed(3));
    setToPrice(value);
  };

  useEffect(() => {
    onChangeFromPrice(fromPrice);
  }, [fromCurrency]);

  useEffect(() => {
    onChangeToPrice(toPrice);
  }, [toCurrency]);

  return (
    <div className="App">
      <Block
        value={fromPrice}
        currency={fromCurrency}
        onChangeCurrency={setFromCurrency}
        onChangeValue={onChangeFromPrice}
      />
      <Block
        value={toPrice}
        currency={toCurrency}
        onChangeCurrency={setToCurrency}
        onChangeValue={onChangeToPrice}
      />
    </div>
  );
}

export default App;
