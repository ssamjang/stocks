import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, View, 
TouchableOpacity, AsyncStorage, FlatList, TouchableOpacityBase, TouchableHighlight, TouchableWithoutFeedback} from 'react-native';
import { useStocksContext } from '../contexts/StocksContext';
import { scaleSize } from '../constants/Layout';

const API_KEY = '?apikey=b888e1d7c9684be0722f58f601b0f582'
// const API_KEY = '?apikey=15b6b386127d855314ed8c99bff64f8a'
// const API_KEY = '?apikey=7a453ad3eab49ac22bc22d18dd2675bb'

const detailAPI = 'https://financialmodelingprep.com/api/v3/historical-price-full/';

export const StockListRow = ({item, state, selectStock}) => {
  if (state && state[item]){
    return(
      <TouchableHighlight
      onPress={()=> selectStock(item)}
      >
      <View style={styles.stockDetail}>
        <Text style={styles.symbol}>
          {item}
          {/* <View>
            {console.log("Drawing: ")}
            {console.log(item)}
            {console.log(state)}
          </View> */}
        </Text>
        <Text style={styles.symbol}>
          {state[item].close.toFixed(2)}
        </Text>
        <Text style={[
          styles.percentage,
          {backgroundColor: getPercentageColour(state[item].changePercent)}
          ]}>
          {state[item].changePercent.toFixed(2)}%
          {console.log("Draw finished")}
          {console.log(item)}
        </Text>
      </View>
    </TouchableHighlight>
    )
  } else{
    console.log("missing:")
    console.log(item)
    return null
  }
}

export const StockContainer = ({watchList, state, selectStock}) => {
  // console.log("=================WATCHLIST")
  // console.log(watchList)
  // console.log(state)
  // if (state === null) {
  //   console.log('loading fail NULL')
  //   return <Text style={styles.symbols}>LOADING</Text>
  // } else if (Object.keys(state).length === watchList.symbols.length){
  // } else if (Object.keys(state).length === watchList.symbols.length){
  //}else if (watchList.selectedStock && state && state[watchList.selectedStock]) {
  // console.log("====================================================")
  // console.log(watchList)
  // console.log("Selected stock") 
  // console.log(watchList.selectedStock)
  // console.log("state")
  // console.log(state)
  // // console.log(watchList.selectedStock in state)
  // console.log("====================================================")
  if (watchList.selectedStock && state && (watchList.selectedStock in state)) {
  // if (watchList.selectedStock && state && state[watchList.selectedStock]) {
      return(
        <FlatList
          // data={watchList.symbols}
          data={watchList.symbols}
          renderItem={({item}) => (
            <StockListRow item={item} state={state} selectStock={selectStock}/>
            
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
    // watchList.symbols.pop()
    console.log(watchList.symbols)
    AsyncStorage.clear()
    setState({})
  };

  const clearWatchList = () => {
    while(watchList.symbols.length) {
      let item = watchList.symbols.pop()
      console.log(item)
      }
      console.log(watchList.symbols)
  }

  async function getLocalData () {
    const dataCalled = await callLocalStorage()
    console.log("local fetched")
    console.log(state)
    return dataCalled
  }

  async function callLocalStorage() {
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
              // return mergedData
              setState(mergedData)
              AsyncStorage.setItem("stockData", JSON.stringify(state))
            }))
            .catch((err) => {
              throw new Error("Stock info fetch failed: ", err)
            })
          
  }

  useEffect(() => {
    console.log("useeffect called=======================++++++++++++++===========")
    if (watchList && watchList.symbols) {
      getLocalData()
      watchList.symbols.forEach((symbol) => {
        if (!state[symbol]) {
          // console.log("NO MATCHING SYMBOL==============================")
          // fetch(`${detailAPI}${symbol}${API_KEY}`)
          //   .then((res) => res.json())
          //   .then((data => {
          //     let newData = {}
          //     let mergedData = {}
          //     newData[symbol] = data.historical[0]
          //     mergedData = {...state, ...newData}
          //     // return mergedData
          //     setState(mergedData)
          //     AsyncStorage.setItem("stockData", JSON.stringify(state))
          //   }))
          //   .catch((err) => {
          //     throw new Error("Stock info fetch failed: ", err)
          //   })
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
          <Text style={styles.test}>CLEAR STORAGE</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => clearWatchList()}
        >
          <Text style={styles.test}>WATCHLIST</Text>
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