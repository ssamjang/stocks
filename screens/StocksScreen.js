import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, View, 
TouchableOpacity, AsyncStorage, FlatList} from 'react-native';
import { useStocksContext } from '../contexts/StocksContext';
import { scaleSize } from '../constants/Layout';

// FixMe: implement other components and functions used in StocksScreen here (don't just put all the JSX in StocksScreen below)

export const StockContainer = ({watchList}) => {
  if (watchList.symbols) {
    return(
      <FlatList
        data={watchList.symbols}
        renderItem={({item}) => (
          <View>
            <Text style={styles.test}>
              {item}
            </Text>
          </View>
        )}
        keyExtractor={item=>item}
      />
    )
  }
}

export default function StocksScreen({route}) {
  const { ServerURL, watchList } = useStocksContext();
  const [state, setState] = useState({ /* FixMe: initial state here */ });

  const clearStorage = () => {
    watchList.symbols.pop()
    console.log(watchList.symbols)
  };


  // can put more code here

  useEffect(() => {
    // FixMe: fetch stock data from the server for any new symbols added to the watchlist and save in local StocksScreen state  
  }, [watchList]);

  return (

    <View style={styles.container}>
        {/* FixMe: add children here! */ }
        <Text style={styles.test}>
          STOCKS 2222222
        </Text>
        <TouchableOpacity
          onPress={() => clearStorage()}
        >
          <Text style={styles.test}>CLEAR STORAGE</Text>
        </TouchableOpacity>
        <StockContainer watchList={watchList}/>
    </View>
  );
}

const styles = StyleSheet.create({
  // FixMe: add styles here ...
  // use scaleSize(x) to adjust sizes for small/large screens
    test: {
      backgroundColor: '#DDDD',
      alignContent: 'center',
      color: 'black',
      fontSize: 60
    }
  });