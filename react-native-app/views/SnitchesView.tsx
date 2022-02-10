import React, { useContext, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SnitchService from '../backend/services/SnitchService';
import PageSection from '../components/PageSection';
import SnitchEventCard from '../components/SnitchEventCard';
import { userContext } from '../navigation/mainNavigator';
import moment from 'moment';
import SnitchEvent from '../shared/models/SnitchEvent';
import User from '../shared/models/User';
import PaginatedList from '../components/PaginatedList';
import { UserSnitchesResponse } from '../shared/models/requests/UserSnitchesRequest';
import SocialShareBtn from '../components/SocialShareBtn';

const PAGE_SIZE = 10

const SnitchesView: React.FC = () => {
  const [lastSnitch, setLastSnitch] = useState<SnitchEvent|undefined>(undefined);
  const [userDict, setUserDict] = useState<Map<string,User>>(new Map());
  const [feedIds, setFeedIds] = useState<string[]|null>(null);

  const {currentUser} = useContext(userContext);

  useEffect(()=>{
    getFeedUsers();
  }, [])

  if (!feedIds) return null;

  async function getFeedUsers() {
    if (!currentUser) throw new Error("There is no logged in user!")
    let users = await new SnitchService().getFeedUsers(currentUser.userId)
    let ids:string[] = [];
    let map = new Map<string, User>();
    users.forEach(u=>{
      ids.push(u.userId)
      map.set(u.userId,u)
    })
    setFeedIds(ids)
    setUserDict(map)
  }

  async function loadNextPage(prevPage?: UserSnitchesResponse) {
    if (!feedIds) throw new Error("There are no users for the feed!")
    let page = prevPage || {records:[],pageBreakKey:undefined,pageSize:PAGE_SIZE}
    let response = await new SnitchService().getUserSnitchFeedPage(feedIds,page)
    response.records.sort((a,b)=>a.created<b.created?1:-1)
    if (!prevPage) {
      // The process of loading the feed also gets all feed user data, so let's save that
      // rather than askig for it again later
      setLastSnitch(response.records[0])
    }
    return response;
  }


  let streak = (() => {
    if (!lastSnitch) return null;
    return {
      qty: moment().diff(moment(lastSnitch.created), 'd'),
      unit: 'day'
    }
  })();

  return (
  <ScrollView style={{height: '100%'}}>
    <View style={styles.container}>
      { streak ? 
        <PageSection title='Snitch-Free Streak'>
          <View style={styles.streakWrapper}>
            <View style={[styles.streakChild, styles.streakFire]}><Icon name="whatshot" color="red" size={55} /></View>
            <Text style={[styles.streakChild, styles.streakQty]}>
              <Text>{streak.qty}</Text>
              <Text style={styles.streakUnit}>&nbsp;{streak.unit}{streak.qty === 1 ? '' : 's'}</Text>
            </Text>
          </View>
        </PageSection>      
      :
        null
      }

      <PageSection title="Recent Snitches">
        <PaginatedList
          loadNextPage={loadNextPage}
          itemKey={(snitch:SnitchEvent)=>snitch.created+snitch.userId}
          renderItem={(snitch=>(
            <View style={styles.snitchContainer}>
              <SnitchEventCard snitch={snitch} user={userDict.get(snitch.userId)}></SnitchEventCard>
            </View>
          ))}
        />
        
        {/* { snitches.map((s,i) => (
          <>
          <View style={styles.snitchContainer} key={s.created+s.userId}>
            <SnitchEventCard snitch={s} user={knownUsers.get(s.userId)}></SnitchEventCard>
          </View>
          <View style={styles.divider} />
          </>
        ))} */}

      </PageSection>
    </View>
  </ScrollView>
  );
};

const styles = StyleSheet.create({
  streakWrapper: {
    position: "relative",
    height: 80,
  },
  streakChild: {
    position: "absolute",
  },
  streakFire: {
    left: 0,
    bottom: 0
  },
  streakQty: {
    left: 60,
    fontSize: 100,
    flexDirection: 'row',
    alignItems: 'baseline',
    bottom: -20,
  },
  streakUnit: {
    fontSize: 30,
    marginLeft: 5
  },
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
    width: '100%',
  },
  snitchContainer: {
  },
});

export default SnitchesView;