import React, { createContext, useContext, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Button } from 'react-native';
import SnitchService from '../../backend/services/SnitchService';
import CheatMealService from '../../backend/services/CheatMealService';
import CheatMealEvent from '../../shared/models/CheatMealEvent';
import { UserCheatMealResponse } from '../../shared/models/requests/UserCheatMealRequest';
import { UserSnitchesResponse } from '../../shared/models/requests/UserSnitchesRequest';
import SnitchEvent from '../../shared/models/SnitchEvent';
import User from '../../shared/models/User';
import CheatMealEventCard from '../MealEventCard';
import PaginatedList from '../PaginatedList';
import PartnerAssociationRequestButton from '../PartnerAssociationRequestButton';
import ProfileImage from '../ProfileImage';
import SnitchEventCard from '../SnitchEventCard';
import { globalContext } from '../../navigation/appNavigator';
import { observer } from 'mobx-react-lite';
import { ClientStore, PartnerStore, TrainerStore } from '../../stores/PeopleStores';
import ProfilePartners from './ProfilePartners';
import Card from '../Card';
import ProfileTrainer from './ProfileTrainer';
import MatButton from '../MatButton';
import CheatMealSchedule from '../CheatMealSchedule';
import SnitchFreeStreak from '../SnitchFreeStreak';
import CheatMealRemaining from '../CheatMealRemaining';
import Colors from '../../assets/constants/colors';

const PAGE_SIZE = 5;

export var profileContext: React.Context<{
  refresh:()=>void,
  profileOwner: User,
  isCurrentUser: boolean,
  isClientOfCurrentUser: boolean,
  isPartnerOfCurrentUser: boolean,
  profilePartnerStore: PartnerStore,
  profileClientStore: ClientStore,
  profileTrainerStore: TrainerStore
}>;

const Profile = observer(({profileOwner}:any) => {
  const [refreshCnt, setRefreshSCnt] = useState(0);

  const {currentUser, clientStore, partnerStore, trainerStore} = useContext(globalContext);

  const isCurrentUser = profileOwner.userId === currentUser.userId;
  
  const profilePartnerStore = isCurrentUser? partnerStore : new PartnerStore(profileOwner);
  const profileClientStore = isCurrentUser? clientStore : new ClientStore(profileOwner);
  const profileTrainerStore = isCurrentUser? trainerStore : new TrainerStore(profileOwner);

  const isClientOfCurrentUser = isCurrentUser? false : clientStore.isClientOfUser(profileOwner.userId);
  const isPartnerOfCurrentUser = isCurrentUser? false : partnerStore.isPartnerOfUser(profileOwner.userId);
  
  const pCtx = {
    refresh() {
      setRefreshSCnt(refreshCnt+1)
    },
    profileOwner,
    isCurrentUser,
    isClientOfCurrentUser,
    isPartnerOfCurrentUser,
    profilePartnerStore,
    profileClientStore,
    profileTrainerStore,
  }
  profileContext = createContext(pCtx)

  async function loadNextCheatMealPage(prevPage?: UserCheatMealResponse) {

    let page = prevPage || {records:[],pageBreakKey:undefined,pageSize:PAGE_SIZE}
    let response = await new CheatMealService().getUserChealMealFeedPage(profileOwner.userId,page)
    response.records.sort((a,b)=>a.created<b.created?1:-1)
    return response;
  }

  
const SnitchFeed = () => {
  const [lastSnitch, setLastSnitch] = useState<SnitchEvent|undefined>(undefined);

  async function loadNextSnitchPage(prevPage?: UserSnitchesResponse) {
    let page = prevPage || {records:[],pageBreakKey:undefined,pageSize:PAGE_SIZE}
    let response = await new SnitchService().getUserSnitchFeedPage([profileOwner.userId],page)
    response.records.sort((a,b)=>a.created<b.created?1:-1)
    if (!prevPage) {
      // The process of loading the feed also gets all feed user data, so let's save that
      // rather than askig for it again later
      setLastSnitch(response.records[0])
    }
    return response;
  }


  return (
    <Card title="Snitches" headerRight={<SnitchFreeStreak lastSnitch={lastSnitch} size={35} />}>
      <PaginatedList
            loadNextPage={loadNextSnitchPage}
            itemKey={(snitch:SnitchEvent)=>snitch.created+snitch.userId}
            renderItem={(snitch=>(
            <View>
              <SnitchEventCard onSwitch={()=>setRefreshSCnt(refreshCnt+1)}
                snitch={snitch} user={profileOwner} />
            </View>
          ))}
        />
    </Card>
  )
}

  return (
    <profileContext.Provider value={pCtx}>
    <View style={[styles.container]}>
      <ScrollView>
        <View style={[styles.header]}>
          <ProfileImage user={profileOwner} size={75}></ProfileImage>
          <View style={styles.headerDetails}>
            <Text numberOfLines={1} style={styles.profileName}>{profileOwner.firstname || "Test"} {profileOwner.lastname || ""}</Text>
            <View style={{flexDirection: 'row'}}>
              { isCurrentUser ? (
                <MatButton color={Colors.lightBackground} textColor={Colors.white} title="Edit Profile" /> // TODO implement profile settings
              ) : (
                <PartnerAssociationRequestButton profileOwner={profileOwner} />
              )}
            </View>
          </View>
        </View>

        <View style={{}}>

          <View style={styles.profileDetails}>
            <ProfileTrainer />
            <ProfilePartners />
          </View>

          {currentUser === profileOwner || isClientOfCurrentUser || isPartnerOfCurrentUser ?
        
            <Card title="Cheat Meals">
              {(isClientOfCurrentUser || isCurrentUser) &&
                <View style={{marginBottom: 10}}>
                  <CheatMealRemaining />
                  <CheatMealSchedule profileOwner={profileOwner} canEdit={isClientOfCurrentUser || !trainerStore.data} />
                </View>
              }
              <PaginatedList
                  loadNextPage={loadNextCheatMealPage}
                  itemKey={(meal:CheatMealEvent)=>meal.created+meal.userId}
                  renderItem={(meal=>(
                  <View>
                    <CheatMealEventCard meal={meal} user={profileOwner}></CheatMealEventCard>
                  </View>
                ))}
              />
            </Card>
          : null}

          {currentUser === profileOwner || isClientOfCurrentUser || isPartnerOfCurrentUser ?
            <SnitchFeed />
            
          :<></>}

        </View>
      </ScrollView>
    </View>
    </profileContext.Provider>
  );
});


const EMPTY_COLOR = "grey";
const PROGRESS_COLOR = "green";
const SIZE = 45;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background
  },
  header: {
    flex: 1,
    maxHeight: 150,
    position: 'relative',
    flexDirection: 'row',
    backgroundColor: Colors.darkRed,
    paddingVertical: 20,
    paddingHorizontal: 15,
    textAlign: 'left',
    alignItems: 'center',
  },
  headerDetails: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    padding: 3,
    marginLeft: 15
  },
  profileName: {
    flex: 2,
    backgroundColor: Colors.darkRed,
    fontSize: 28,
    lineHeight: 28,
    fontWeight: 'bold',
    color: Colors.white
  },
  profileDetails: {
    padding: 10,
    marginVertical: 5
  },
  progressCircle: {
    flexDirection: 'row',
    borderColor: EMPTY_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    borderWidth: 7,
  },
  indicator: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    borderWidth: 7,
    position: 'absolute',
    borderLeftColor: PROGRESS_COLOR,
    borderTopColor: PROGRESS_COLOR,
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
  },

});

export default Profile;
