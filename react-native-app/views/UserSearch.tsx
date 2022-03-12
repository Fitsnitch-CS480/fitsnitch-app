import { useNavigation } from '@react-navigation/native';
import React, { useContext, useState } from 'react';
import { Button, Keyboard, ScrollView, StyleSheet, Text, TextInput, TouchableHighlight, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import UserDataService from '../backend/services/UserDataService';
import ProfileImage from '../components/ProfileImage';
import { globalContext } from '../navigation/appNavigator';
import { UserSearchRequest, UserSearchResponse } from '../shared/models/requests/UserSearchRequest';
import User from '../shared/models/User';

type state = {
  results: User[],
  lastPageBreakKey?: string,
  loading: boolean,
  query?:string
}

const PAGE_SIZE = 20;

const UserSearch: React.FC = () => {
  const navigation = useNavigation();
  
  const [currentUser] = useContext(globalContext).currentUserState;

  const [state, setState] = useState<state>({
    results: [],
    lastPageBreakKey: undefined,
    loading: false,
    query: undefined,
  });

  let flexibleState: state = {...state};
  function updateState(props:Partial<state>) {
    flexibleState = {...flexibleState, ...props};
    setState({...flexibleState})
  }

  async function loadNewResults() {
    Keyboard.dismiss();
    console.log("loading new results")
    if (!state.query) {
      updateState({results:[]})
      return;
    }
    updateState({loading:true})
    let page = await loadUntilResultsOrEnd(state.query, state.lastPageBreakKey)
    console.log(page.records.length)
    updateState({
      loading:false,
      results: page.records,
      lastPageBreakKey: page.pageBreakKey
    })
  }


  async function loadMoreResults() {
    if (!state.query) return;
    console.log("loading next page")
    updateState({loading:true})
    let page = await loadUntilResultsOrEnd(state.query, state.lastPageBreakKey)
    updateState({
      loading:false,
      results: state.results.concat(page.records),
      lastPageBreakKey: page.pageBreakKey
    })
  }

  /**
   * Sometimes a page returns 0 results but hasn't looked at all records yet.
   * This should probably be solved on the backend, but for now this method
   * will keep requesting until it has no more pages or finds some results.
   */
  async function loadUntilResultsOrEnd(query:string, lastPageBreakKey:any): Promise<UserSearchResponse> {
    let page = await new UserDataService().userSearch(new UserSearchRequest(
      query, lastPageBreakKey, PAGE_SIZE))

    while (page.pageBreakKey && page.records.length === 0) {
      page = await new UserDataService().userSearch(new UserSearchRequest(
      query, page.pageBreakKey, PAGE_SIZE))
    }

    return page;
  }

  function updateQuery(text:string) {
    updateState({
      query:text,
      results: [],
      lastPageBreakKey: undefined
    })
  }

  return (
    <>
    <View style={styles.searchBarWrapper}>
      <TextInput placeholder="Type a user's name" style={styles.searchInput}
        onChangeText={(text)=>updateQuery(text)}></TextInput>
      <TouchableHighlight style={styles.searchIconButton} onPress={loadNewResults} underlayColor="#ccc"><Icon name="search" size={30} /></TouchableHighlight>
    </View>

    <ScrollView>
      { state.results.map(user =>(
        <View style={styles.resultRow} key={user.userId} onTouchEnd={()=>{navigation.navigate("OtherUserProfile", {profileOwner: user})}}>
          <ProfileImage user={user} size={30}></ProfileImage>
          <Text style={{marginLeft:10, fontSize: 15}}>{user.firstname} {user.lastname}</Text>
        </View>
      ))}

      { state.lastPageBreakKey && state.results.length > 0 ?
        <Button title="Load More" onPress={loadMoreResults}></Button>
      :
        <></>
      }
    </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  searchBarWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd'
  },
  searchInput: {
    flexGrow: 1,
    padding: 10,
    fontSize: 15
  },
  searchIconButton: {
    padding: 10
  },

  resultRow: {
    backgroundColor: "white",
    padding: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd'
  }
})
export default UserSearch;