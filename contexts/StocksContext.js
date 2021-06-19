import React, { useState, useContext, useEffect } from "react";
import { AsyncStorage } from "react-native";

const StocksContext = React.createContext();

export const StocksProvider = ({ children }) => {
  const [state, setState] = useState({
    symbols: [],
    selectedStock: "",
    stockInfo: {}
  });

  return (
    <StocksContext.Provider value={[state, setState]}>
      {children}
    </StocksContext.Provider>
  );
};

export const useStocksContext = () => {
  const [state, setState] = useContext(StocksContext);

  // can put more code here

  function addToStockInfo(stock) {
    setState((oldState) => ({...oldState, stockInfo: stock}))
    AsyncStorage.setItem("stockData", JSON.stringify(state))
  }

  function addToWatchlist(newSymbol) {
    //FixMe: add the new symbol to the watchlist, save it in useStockContext state and persist to AsyncStorage
    if (state.symbols && state.symbols.length > 0) { 
      if (state.symbols && state.symbols.indexOf(newSymbol) >=0){
        return;
      } else {
        state.symbols.push(newSymbol);
        const updatedList = state.symbols.sort();
        setState((old) => ({...old, symbols: updatedList}))
        AsyncStorage.setItem("symbols", JSON.stringify(updatedList))
      }
    } else {
      setState((oldState) => ({...oldState, symbols: [newSymbol]}))
      AsyncStorage.setItem("symbols", JSON.stringify([newSymbol]))
    }
    selectStock(newSymbol)
  }

  function selectStock(selectedStock) {
    setState((oldState) => ({...oldState, selectedStock}))
    AsyncStorage.setItem("selectedStock", JSON.stringify(selectedStock))
  }

  useEffect(() => {
    // FixMe: Retrieve watchlist from persistent storage
    AsyncStorage.getItem("symbols")
      .then((list) => JSON.parse(list))
      .then((list) => {
        if (list) {
          setState((oldState) => ({...oldState, symbols: list}))
        }
      })
    AsyncStorage.getItem("selectedStock")
      .then((selectedStock) => JSON.parse(selectedStock))
      .then((selectedStock) => {
        if (selectedStock) {
          setState((oldState) => ({...oldState, selectedStock}))
        }
      })
    AsyncStorage.getItem("stockData")
      .then((stocks) => JSON.parse(stocks))
      .then((stockInfo) => {
        if (stockInfo){
          setState((oldState) => ({...oldState, stockInfo: stockInfo}))
        }
      })
  
  }, []);

  return { 
    //ServerURL: 'http://131.181.190.87:3001', 
    // ServerURL: 'https://financialmodelingprep.com/api/v3/nasdaq_constituent?apikey=b888e1d7c9684be0722f58f601b0f582',
    // ServerURL: 'https://financialmodelingprep.com/api/v3/nasdaq_constituent?apikey=15b6b386127d855314ed8c99bff64f8a',
    // ServerURL: 'https://financialmodelingprep.com/api/v3/nasdaq_constituent?apikey=7a453ad3eab49ac22bc22d18dd2675bb',
    ServerURL: 'https://financialmodelingprep.com/api/v3/nasdaq_constituent?apikey=e067f49be6b7355047054ccf03bd6d1a' ,
    watchList: state,  
    addToWatchlist,
    selectStock,
    addToStockInfo, };
};
