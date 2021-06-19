import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, View, 
TouchableOpacity, AsyncStorage, FlatList, TouchableOpacityBase, TouchableHighlight, TouchableWithoutFeedback} from 'react-native';
import { useStocksContext } from '../contexts/StocksContext';
import { scaleSize } from '../constants/Layout';

// const API_KEY = '?apikey=b888e1d7c9684be0722f58f601b0f582'
// const API_KEY = '?apikey=15b6b386127d855314ed8c99bff64f8a'
// const API_KEY = '?apikey=7a453ad3eab49ac22bc22d18dd2675bb'
const API_KEY = '?apikey=e067f49be6b7355047054ccf03bd6d1a'

const detailAPI = 'https://financialmodelingprep.com/api/v3/historical-price-full/';

export const StockListRow = ({item, state, selectStock, watchList}) => {
  return(
    <TouchableHighlight
    onPress={()=> selectStock(item)}
    >
    <View 
      style={[styles.stockDetail, 
        {backgroundColor: getSelectedBackground(item, watchList)}]}
    >
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
  </TouchableHighlight>
  )
}

export const StockContainer = ({watchList, state, selectStock}) => {
  if (watchList.selectedStock && state && (watchList.selectedStock in state)) {
      return(
        <FlatList
          // data={watchList.symbols}
          data={Object.keys(state)}
          renderItem={({item}) => (
            <StockListRow 
              item={item} 
              state={state} 
              selectStock={selectStock} 
              watchList={watchList}/>
          )}
          keyExtractor={item=>item}
        />
      )
    } else {
      console.log('loading fail END')
      return (
        <View>
          <Text style={styles.symbols}>LOADING EEEEEND</Text>
        </View>
      )
    }   
  }

function getPercentageColour(value) {
  if (value >= 0) {
    return 'green'
  } else {
    return 'red'
  }
}

function getSelectedBackground(item, watchList) {
  if (item === watchList.selectedStock) {
    return "#222"
  } else {
    return "#000"
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
            heading="VOL"
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
  const { ServerURL, watchList, selectStock, addToStockInfo } = useStocksContext();
  const [state, setState] = useState({});
  const [loading, setLoading] = useState(true)

  const clearStorage = () => {
    while(watchList.symbols.length) {
    let item = watchList.symbols.pop()
    console.log(item)
    }
    console.log(watchList.symbols)
    AsyncStorage.clear()
    setState({})
  };

  async function getLocalData (state) {
    const dataCalled = await callLocalStorage(state)
    console.log("local fetched")
    console.log(state)
    return dataCalled
  }

  async function callLocalStorage(state) {
    AsyncStorage.getItem("stockData")
      .then((stocks) => JSON.parse(stocks))
      .then((stockInfo) => {
        let updatedInfo = {...state, ...stockInfo}
        setState(updatedInfo)
      })
  }

  async function getApiData (symbol) {
    const dataCalled = await callApi(symbol)
    console.log("API fetched")
    console.log(state)
    return dataCalled
  }

  async function callApi(symbol) {
    fetch(`${detailAPI}${symbol}${API_KEY}`)
            .then((res) => res.json())
            .then((data => {
              let newData = {}
              let mergedData = {}
              newData[symbol] = data.historical[0]
              mergedData = {...state, ...newData}
              setState(mergedData)
              AsyncStorage.setItem("stockData", JSON.stringify(mergedData))
            }))
            .catch((err) => {
              throw new Error("Stock info fetch failed: ", err)
            })
          
  }

  useEffect(() => {
    if (watchList && watchList.symbols) {
      getLocalData(state)
      console.log(state)
      watchList.symbols.forEach((symbol) => {
        if (!state[symbol]) {
          getApiData(symbol)
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
          <Text style={styles.clearList}>Clear Watch List</Text>
        </TouchableOpacity>

        <StockContainer 
          watchList={watchList} 
          state={state} 
          loading={loading}
          selectStock={selectStock}
        />
        <StockTable state={state} watchList={watchList}/>
    </View>
  );
}

const styles = StyleSheet.create({
    header: {
      color: "#fff",
      fontSize: scaleSize(30),
      textAlign: 'center',
      paddingVertical: 10,
    },
    percentage: {
      color: "#fff",
      fontSize: scaleSize(25),
      borderRadius: 10,
      paddingHorizontal: 10,
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
      marginTop: 10,
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
    clearList: {
      backgroundColor: '#DDDD',
      alignContent: 'center',
      color: 'black',
      fontSize: scaleSize(20),
      padding: 10,
    },
  });