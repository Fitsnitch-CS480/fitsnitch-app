import React, { useContext, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import SnitchService from '../services/SnitchService';
import Card from '../components/Card';
import SnitchEventCard from '../components/SnitchEventCard';
import SnitchEvent from '../shared/models/SnitchEvent';
import User from '../shared/models/User';
import PaginatedList from '../components/PaginatedList';
import { UserSnitchesResponse } from '../shared/models/requests/UserSnitchesRequest';
import { useNavigation } from '@react-navigation/native';
import { globalContext } from './appNavigator';
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
    response.records.sort((a,b)=>a.created_at<b.created_at?1:-1)
    if (!prevPage) {
      // The process of loading the feed also gets all feed user data, so let's save that
      // rather than askig for it again later
      setLastSnitch(response.records[0])
    }
    return response;
  }


  return (
  <ScrollView style={styles.screen}>
    <View style={styles.container}>
      <Card title='Snitch-Free Streak'>
        <SnitchFreeStreak lastSnitch={lastSnitch} size={100} />
      </Card>

      <Card title="Recent Snitches">
        <PaginatedList
          loadNextPage={loadNextPage}
          itemKey={(snitch:SnitchEvent)=>snitch.created_at+snitch.userId}
          renderItem={(snitch=>(
            <View style={styles.snitchContainer}>
              <SnitchEventCard snitch={snitch} user={userDict.get(snitch.userId)}></SnitchEventCard>
            </View>
          ))}
        />

      </Card>
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