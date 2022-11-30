import React, { useContext, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import SnitchService from '../backend/services/SnitchService';
import PageSection from '../components/PageSection';
import SnitchEventCard from '../components/SnitchEventCard';
import moment from 'moment';
import SnitchEvent from '../shared/models/SnitchEvent';
import User from '../shared/models/User';
import PaginatedList from '../components/PaginatedList';
import { UserSnitchesResponse } from '../shared/models/requests/UserSnitchesRequest';
import { useNavigation } from '@react-navigation/native';
import { globalContext } from '../navigation/appNavigator';
import SnitchFreeStreak from '../components/SnitchFreeStreak';
import Colors from '../assets/constants/colors';

const PAGE_SIZE = 10

const SnitchesView: React.FC = () => {
  const [lastSnitch, setLastSnitch] = useState<SnitchEvent|undefined>(undefined);

  const {currentUser, trainerStore, partnerStore, clientStore} = useContext(globalContext);
  const navigation = useNavigation<any>()

  const feedUsers: (User | null)[] = [
    currentUser,
    trainerStore.data,
    ...partnerStore.data,
    ...clientStore.data,
  ]

  const feedIds: string[] = [];
  const userDict = new Map<string,User>();

  feedUsers.forEach(u => {
    if (!u) return;
    feedIds.push(u.userId);
    userDict.set(u.userId, u);
  })

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
  <ScrollView style={styles.screen}>
    <View style={styles.container}>
      <PageSection title='Snitch-Free Streak'>
        <SnitchFreeStreak lastSnitch={lastSnitch} size={100} />
      </PageSection>      

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
  screen: {
    backgroundColor: Colors.background,
    height: '100%',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
  },
  snitchContainer: {
  },
});

export default SnitchesView;