import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import Colors from '../assets/constants/colors';
import T from '../assets/constants/text';
import { PaginatedResponse } from '../shared/models/requests/Paginated';
import MatButton from './MatButton';

interface Props<TItem, TResponse extends PaginatedResponse<TItem>> {
  loadNextPage: (prevPage?: TResponse)=>Promise<TResponse>
  renderItem: (item:TItem) => JSX.Element|null|undefined
  itemKey: (item:TItem) => string|number
  initialPage?: TResponse
}


const PaginatedList = <TItem, TResponse extends PaginatedResponse<TItem>> ({
  loadNextPage, renderItem, itemKey, initialPage
}:Props<TItem, TResponse>) => {

  const [results, setResults] = useState<TItem[]>(initialPage?.records || []);
  const [lastPage, setLastPage] = useState<TResponse|undefined>(initialPage);
  const [loading, setLoading] = useState(false);

  useEffect(()=>{
    loadMoreResults()
  }
  ,[])
  
  async function loadMoreResults() {
    setLoading(true);
    let page = await loadUntilResultsOrEnd(lastPage)
    if (lastPage) {
      setResults(results.concat(page.records))
    }
    else {
      setResults(page.records);
    }
    setLastPage(page);
    setLoading(false);
  }

  /**
   * Sometimes a page returns 0 results but hasn't looked at all records yet.
   * This should probably be solved on the backend, but for now this method
   * will keep requesting until it has no more pages or finds some results.
   */
  async function loadUntilResultsOrEnd(lastPage?:TResponse): Promise<TResponse> {
    let page = lastPage;
    do {
      page = await loadNextPage(lastPage);
    } while (page && page.pageBreakKey && page.records.length === 0);
    return page;
  }

  return (
    <ScrollView>
      { results.map(item =>(
        <View style={styles.resultRow} key={itemKey(item)}>
          {renderItem(item)}
        </View>
      ))}

      { loading ?
        <View style={styles.loadingWrapper}><ActivityIndicator color={Colors.red} size={30} /></View>
      :
        results.length === 0 ?
          <Text style={styles.text}>{T.list.empty}</Text>
      :
        lastPage?.pageBreakKey ?
          <MatButton 
            title="Load More" 
            onPress={loadMoreResults} 
            outline
            textColor={Colors.white} 
            style={styles.button}/>
      :
        null
      }
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  resultRow: {
    backgroundColor: Colors.lightBackground,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd'
  },
  loadingWrapper: {
    padding: 20,
  },
  text: {
    color: Colors.white,
  },
  button: {
    width: 150,
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 5,
  },
})
export default PaginatedList;