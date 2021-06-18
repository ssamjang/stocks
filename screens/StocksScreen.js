import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, View, 
TouchableOpacity, AsyncStorage, FlatList, TouchableOpacityBase} from 'react-native';
import { useStocksContext } from '../contexts/StocksContext';
import { scaleSize } from '../constants/Layout';

// const API_KEY = '?apikey=b888e1d7c9684be0722f58f601b0f582'
//const API_KEY = '?apikey=15b6b386127d855314ed8c99bff64f8a'
const API_KEY = '?apikey=7a453ad3eab49ac22bc22d18dd2675bb'

const detailAPI = 'https://financialmodelingprep.com/api/v3/historical-price-full/';

export const StockContainer = ({watchList, state}) => {
  // console.log("=================WATCHLIST")
  // console.log(watchList)
  // console.log(state)
  if (state === null) {
    console.log('loading fail NULL')
    return <Text style={styles.symbols}>LOADING</Text>
  // } else if (Object.keys(state).length === watchList.symbols.length){
  } else if (Object.keys(state).length === watchList.symbols.length){
      return(
        <FlatList
          // data={watchList.symbols}
          data={watchList.symbols}
          renderItem={({item}) => (
            <View style={styles.stockDetail}>
              <Text style={styles.symbol}>
                {item}
              </Text>
              <Text style={styles.symbol}>
                {state[item].close.toFixed(2)}
              </Text>
              <Text style={[
                styles.percentage,
                {backgroundColor: getPercentageColour(state[item].changePercent)}
                ]}>
                {state[item].changePercent.toFixed(2)}%
              </Text>
            </View>
          )}
          keyExtractor={item=>item}
        />
      )
    } else {
      console.log('loading fail END')
      return <Text style={styles.symbols}>LOADING EEEEEND</Text>
    }   
  }

function getPercentageColour(value) {
  if (value >= 0) {
    return 'green'
  } else {
    return 'red'
  }
}

export const TableRow = ({heading, value}) => {
  return(
    <View style={styles.tableRow}>
            <Text style={styles.rowKey}>
              {heading}
            </Text>
            <Text style={styles.rowVal}>
              {value}
            </Text>
          </View>
  )
}

export const StockTable = ({state, watchList}) => {
  // if (true) {
  if (watchList.selectedStock && state && state[watchList.selectedStock]) {
    return (
      <View style={styles.table}>
        <Text style={styles.tableHeader}>
          {watchList.selectedStock}
        </Text>
        <View style={styles.tableContainer}>
          <TableRow
            heading="OPEN"
            value={state[watchList.selectedStock].open}
          />
          <TableRow
            heading="CLOSE"
            value={state[watchList.selectedStock].close}
          />
          <TableRow
            heading="LOW"
            value={state[watchList.selectedStock].low}
          />
          <TableRow
            heading="HIGH"
            value={state[watchList.selectedStock].high}
          />
          <TableRow
            heading="VOLUME"
            value={state[watchList.selectedStock].volume}
          />
        </View>
      </View>
    )
  } else{
    return null
  }
}

export default function StocksScreen({route}) {
  const { ServerURL, watchList } = useStocksContext();
  const [state, setState] = useState({});
  const [loading, setLoading] = useState(true)

  const clearStorage = () => {

    while(watchList.symbols.length) {
    let item = watchList.symbols.pop()
    console.log(item)
    }
    // watchList.symbols.pop()
    console.log(watchList.symbols)
    AsyncStorage.clear()
    setState({})
  };

  useEffect(() => {
    if (watchList && watchList.symbols) {
      // console.log(watchList)
      watchList.symbols.forEach((symbol) => {
        AsyncStorage.getItem("stockData")
          .then((stocks) => JSON.parse(stocks))
          .then((stockInfo) => {
            // setState((oldState) => ({...oldState, stockInfo}))
            setState(stockInfo)
          });
        if (!state[symbol]) {
          fetch(`${detailAPI}${symbol}${API_KEY}`)
            .then((res) => res.json())
            .then((data => {
              let newData = {}
              let mergedData = {}

              newData[symbol] = data.historical[0]
              // // EXP===============================================
              // newData[symbol] = data.historical
              // console.log(newData)
              // // EXP===============================================
              mergedData = {...state, ...newData}
              return mergedData
            }))
            .then(data => {
              setState(data)
              AsyncStorage.setItem("stockData", JSON.stringify(data))
              setLoading(false)
            })
            .catch((err) => {
              throw new Error("Stock info fetch failed: ", err)
            })
            // console.log("STATE STARRRRRT-----------------------------")
            // console.log(state)
            // console.log("STATE END-----------------------------")
          }
      });
    };
  }, [watchList])

  return (
    <View style={styles.container}>
        <Text style={styles.header}>
          Stocks
        </Text>
        <TouchableOpacity
          onPress={() => clearStorage()}
        >
          <Text style={styles.test}>CLEAR STORAGE</Text>
        </TouchableOpacity>
        <StockContainer watchList={watchList} state={state} loading={loading}/>
        <StockTable state={state} watchList={watchList}/>
    </View>
  );
}

const styles = StyleSheet.create({
  // FixMe: add styles here ...
  // use scaleSize(x) to adjust sizes for small/large screens
    header: {
      color: "#fff",
      fontSize: scaleSize(30),
      textAlign: 'center',
      paddingVertical: 10,
    },
    percentage: {
      color: "#fff",
      fontSize: scaleSize(25),
      // backgroundColor: 'red'
    },
    stockDetail: {
      flex: 1,
      flexDirection: "row",
      color: "#fff",
      fontSize: scaleSize(30),
      padding: 10,
      // justifyContent: "",
    },
    symbol: {
      color: "#fff",
      fontSize: scaleSize(30),
      flex: 1,
    },
    table: {
      position: "relative",
      color: "#fff",
      bottom: 0,
    },
    tableContainer: {
      flexDirection: "row",
      flexWrap: 'wrap',
    },
    rowKey: { 
      fontSize: scaleSize(20),
      color: "grey"
    },
    rowVal: { 
      fontSize: scaleSize(20),
      color: "#fff"
    },
    tableHeader: {
      color: "#fff",
      fontSize: scaleSize(20),
      textAlign: "center",
      backgroundColor: "#222",
      borderColor: "#eee",
      borderWidth: 0.2,
      paddingVertical: 10,
    },
    tableRow: {
      flexDirection: "row",
      color: "#fff",
      width: "50%",
      justifyContent: "space-between",
      // fontSize: scaleSize(40),
      padding: 10,
      borderColor: "#fff",
      borderWidth: 0.2,
    },
    test: {
      backgroundColor: '#DDDD',
      alignContent: 'center',
      color: 'black',
      fontSize: 60
    },
  });