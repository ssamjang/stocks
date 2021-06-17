import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, View, 
TouchableOpacity, AsyncStorage, FlatList} from 'react-native';
import { useStocksContext } from '../contexts/StocksContext';
import { scaleSize } from '../constants/Layout';

// const API_KEY = '?apikey=b888e1d7c9684be0722f58f601b0f582'
//const API_KEY = '?apikey=15b6b386127d855314ed8c99bff64f8a'
const API_KEY = '?apikey=7a453ad3eab49ac22bc22d18dd2675bb'

const detailAPI = 'https://financialmodelingprep.com/api/v3/historical-price-full/';

export const StockContainer = ({watchList, state, loading}) => {
  if (state === null) {
    console.log('loading fail NULL')
    return <Text style={styles.symbols}>LOADING</Text>
  } else if (Object.keys(state).length === watchList.symbols.length){
      return(
        <FlatList
          data={watchList.symbols}
          renderItem={({item}) => (
            <View style={styles.stockDetail}>
              <Text style={styles.symbol}>
                {item}
                {/* {console.log('-----------------inside----------START--')}
                {console.log(item)}
                {console.log(state)}
                {console.log('-----------------inside---------END--')} */}
                {/* {state[item].close} */}
              </Text>
              <Text style={styles.symbol}>
                {state[item].close}
              </Text>
              <Text style={styles.symbol}>
                {state[item].changePercent}
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
              mergedData = {...state, ...newData}
              return mergedData
            }))
            .then(data => {
              // setState((oldState) => ({ ...oldState, data}))
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
    stockDetail: {
      flex: 1,
      flexDirection: "row",
      color: "#fff",
      fontSize: scaleSize(30),
      padding: 10,
      // justifyContent: "",
    }
    ,
    symbol: {
      color: "#fff",
      fontSize: scaleSize(30),
      flex: 1,
    },
    test: {
      backgroundColor: '#DDDD',
      alignContent: 'center',
      color: 'black',
      fontSize: 60
    },
  });