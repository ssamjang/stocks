import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, View /* include other react-native components here as needed */ } from 'react-native';
import { useStocksContext } from '../contexts/StocksContext';
import { scaleSize } from '../constants/Layout';


// FixMe: implement other components and functions used in StocksScreen here (don't just put all the JSX in StocksScreen below)







export default function StocksScreen({route}) {
  const { ServerURL, watchList } = useStocksContext();
  const [state, setState] = useState({ /* FixMe: initial state here */ });

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