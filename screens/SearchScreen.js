import React, { useState, useEffect } from 'react';
import { 
  Text,
  TextInput,
  StyleSheet, 
  View, 
  TouchableWithoutFeedback, 
  Keyboard,
  FlatList, 
  AsyncStorage,
  TouchableHighlight} from 'react-native';
import { useStocksContext } from '../contexts/StocksContext';
import { scaleSize } from '../constants/Layout';


export const SymbolContainer = ({data, navigation, watchList}) => {
  // // sort list by symbol
  if (data !== null){
    const dataSorted = data.sort((a,b) => (a.symbol > b.symbol) ? 1:-1)

  return(    
    <View>
      <FlatList
        data={dataSorted}
        renderItem={({item}) => (
          <TouchableHighlight 
            style={styles.stockItem}
            onPress={() => {
              navigation.navigate("Stocks");
              watchList(item.symbol)
            }}
          >
            <View>
              <Text style={styles.symbol}>{item.symbol}</Text>
              <Text style={styles.name}>{item.name}</Text>
            </View>
          </TouchableHighlight>
        )}
        keyExtractor={(item) => item.symbol}
      >
      </FlatList>
    </View>
  )
  } else {
    return null
  }
}

export default function SearchScreen({ navigation }) {
  const { ServerURL, addToWatchlist, watchList } = useStocksContext();
   const [rawData, setRawData] = useState([])
   const [filteredData, setFilteredData] = useState([])
   const [search, setSearch] = useState('')
  
   async function getData() {
     const dataCalled = await getStockData()
     return dataCalled
   }

   async function getStockData() {
    fetch(`${ServerURL}`)
      .then((res) => res.json())
      .then(data => 
        data.map(stock => {
            return {
                symbol: stock.symbol,
                name: stock.name,
                sector: stock.sector
            };
        })
      )
      .then((data) => {
        AsyncStorage.setItem("rawData", JSON.stringify(data))
        setRawData(data); setFilteredData(data)
      })
      .catch((err) => {
        throw new Error("Failed to get data: ", err)
      })
  }


  const searchFilter = (searchText) => {
    if (searchText) {
      const newData = rawData.filter((item) => {
        const textData = searchText.toUpperCase();
        const nameData = item.name.toUpperCase();
        return (item.symbol.indexOf(textData) > -1 || nameData.indexOf(textData) > -1)
      })
      setFilteredData(newData)
      setSearch(searchText)
    } else {
      setFilteredData(rawData)
      setSearch(searchText)
    }
  }

  useEffect(() => {
    AsyncStorage.getItem("rawData")
      .then((stocks) => JSON.parse(stocks))
      .then((parsedData) => {
        setRawData(parsedData); 
        setFilteredData(parsedData);
      })
    getData()

  }, []);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View>
          <Text style={styles.searchContainer}>Search for stock</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            value={search}
            onChangeText={(searchText) => searchFilter(searchText)}
          />
        </View>
        <SymbolContainer 
          data={filteredData}
          navigation={navigation}
          watchList={addToWatchlist}
        >
        </SymbolContainer>
      </View>
    </TouchableWithoutFeedback>
  )
}


const styles = StyleSheet.create({
// FixMe: add styles here ...
// use scaleSize(x) to adjust sizes for small/large screens
container: {
  textAlign: 'center',
},
test: {
  backgroundColor: '#DDDD',
  alignContent: 'center',
  color: 'black',
  fontSize: 60
},
searchHeader: {
  padding: 50,
},
searchContainer: {
  backgroundColor: "#111",
  color: "#fff",
  fontSize: scaleSize(30),
  textAlign: 'center',
},
searchInput: {
  backgroundColor: "#fff",
  color: "#000",
  margin: 20,
  fontSize: scaleSize(20),
  height: 40,
},
symbol: {
  color: "#fff",
  fontSize: scaleSize(30),
},
name: {
  color: "#fff",
  fontSize: scaleSize(15),
  paddingTop: 10,
},
stockItem: {
  borderWidth: 1,
  height: 100,
  padding: 10,
  backgroundColor: "#000",
  borderBottomColor: "#ddd",
},
});