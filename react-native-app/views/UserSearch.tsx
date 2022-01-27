import { useNavigation } from '@react-navigation/native';
import React, { useContext, useState } from 'react';
import { Button, ScrollView, StyleSheet, Text, TextInput, TouchableHighlight, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import UserDataService from '../backend/services/UserDataService';
import ProfileImage from '../components/ProfileImage';
import { userContext } from '../navigation/mainNavigator';
import { UserSearchRequest } from '../shared/models/requests/UserSearchRequest';
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
  
  const {currentUser} = useContext(userContext);
  if (!currentUser) return <></>

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
    console.log("loading new results")
    if (!state.query) {
      updateState({results:[]})
      return;
    }
    updateState({loading:true})
    let page = await new UserDataService().userSearch(new UserSearchRequest(
      state.query, undefined, PAGE_SIZE))
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
    let page = await new UserDataService().userSearch(new UserSearchRequest(
      state.query, state.lastPageBreakKey, PAGE_SIZE))
    updateState({
      loading:false,
      results: state.results.concat(page.records),
      lastPageBreakKey: page.pageBreakKey
    })
  }

  return (
    <>
    <View style={styles.searchBarWrapper}>
      <TextInput placeholder="Type a user's name" style={styles.searchInput}
        onChangeText={(query)=>updateState({query})}></TextInput>
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