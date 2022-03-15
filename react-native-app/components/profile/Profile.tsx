import React, { createContext, useContext, useState } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import ClientTrainerService from '../../backend/services/ClientTrainerService';
import PartnerAssociationService from '../../backend/services/PartnerAssociationService';
import SnitchService from '../../backend/services/SnitchService';
import CheatMealService from '../../backend/services/CheatMealService';
import RelationshipStatus from '../../shared/constants/RelationshipStatus';
import CheatMealEvent from '../../shared/models/CheatMealEvent';
import { UserCheatMealResponse } from '../../shared/models/requests/UserCheatMealRequest';
import { UserSnitchesResponse } from '../../shared/models/requests/UserSnitchesRequest';
import SnitchEvent from '../../shared/models/SnitchEvent';
import User from '../../shared/models/User';
import ClientTrainerRequestButton from '../ClientTrainerRequestButton';
import CheatMealEventCard from '../MealEventCard';
import PaginatedList from '../PaginatedList';
import PartnerAssociationRequestButton from '../PartnerAssociationRequestButton';
import ProfileImage from '../ProfileImage';
import SnitchEventCard from '../SnitchEventCard';
import { globalContext } from '../../navigation/appNavigator';
import { observer } from 'mobx-react-lite';


type props = {
  profileOwner: User
}

export var profileContext;

const Profile = observer(({profileOwner}:props) => {
  const [refreshCnt, setRefreshSCnt] = useState(0);
  
  const {currentUser, clientStore, partnerStore} = useContext(globalContext);

  const isCurrentUser = profileOwner.userId === currentUser.userId;
  const isClientOfCurrentUser = isCurrentUser? false : clientStore.isClientOfUser(profileOwner.userId)
  const isPartnerOfCurrentUser = isCurrentUser? false : partnerStore.isPartnerOfUser(profileOwner.userId)

  async function loadNextCheatMealPage(prevPage?: UserCheatMealResponse) {

    let page = prevPage || {records:[],pageBreakKey:undefined,pageSize:20}
    let response = await new CheatMealService().getUserChealMealFeedPage(profileOwner.userId,page)
    response.records.sort((a,b)=>a.created<b.created?1:-1)
    return response;
  }
  
  async function loadNextSnitchPage(prevPage?: UserSnitchesResponse) {

    let page = prevPage || {records:[],pageBreakKey:undefined,pageSize:20}
    let response = await new SnitchService().getUserSnitchFeedPage([profileOwner.userId],page)
    response.records.sort((a,b)=>a.created<b.created?1:-1)

    return response;
  }

  return (
    <View style={[styles.container]}>
      <ScrollView style={styles.scrollView}>
        <View style={[styles.header]}>
          <ProfileImage user={profileOwner} size={75}></ProfileImage>
          <Text style={styles.headerText}>{profileOwner.firstname || "Test"} {profileOwner.lastname || ""}</Text>
        </View>

        <View style={{}}>
          <View style={[styles.body]}>

            {!isCurrentUser ?              
            <View>
              <View style={{paddingBottom: 5}}>
                {/* Client/Trainer Relationship */}
                <ClientTrainerRequestButton profileOwner={profileOwner}></ClientTrainerRequestButton>
              </View>
              <View style={{paddingTop : 5}}>
                {/* Client/Trainer Relationship */}
                <PartnerAssociationRequestButton profileOwner={profileOwner}></PartnerAssociationRequestButton>
              </View>
            </View>
            : <></>}

            <Text style={{fontSize: 15, paddingBottom: 5}}>
              5 Partners: Chef Rush, +4
            </Text>

            {currentUser === profileOwner || isClientOfCurrentUser || isPartnerOfCurrentUser ?
          
            <View style={styles.updateHeader}>

              <View style={{flex: 1}}>


                <Text style={{fontSize: 17, fontWeight: 'bold', paddingTop: 10}}>
                    Cheat Meals
                </Text>
                <PaginatedList
                    loadNextPage={loadNextCheatMealPage}
                    itemKey={(meal:CheatMealEvent)=>meal.created+meal.userId}
                    renderItem={(meal=>(
                    <View>
                      <CheatMealEventCard meal={meal} user={profileOwner}></CheatMealEventCard>
                    </View>
                  ))}
                />
              </View>
            </View>
              :<></>}

          {currentUser === profileOwner || isClientOfCurrentUser || isPartnerOfCurrentUser ?
            <View style={styles.updateHeader}>

              <View style={{flex: 1}}>


                <Text style={{fontSize: 17, fontWeight: 'bold', paddingTop: 10}}>
                    Snitches
                </Text>
                <PaginatedList
                    loadNextPage={loadNextSnitchPage}
                    itemKey={(snitch:SnitchEvent)=>snitch.created+snitch.userId}
                    renderItem={(snitch=>(
                    <View>
                      <SnitchEventCard onSwitch={()=>{setRefreshSCnt(refreshCnt+1)}}  snitch={snitch} user={profileOwner}></SnitchEventCard>
                    </View>
                  ))}
                />
              </View>
            </View>
          :<></>}

          </View>
        </View>
      </ScrollView>
    </View>
  );
});



const EMPTY_COLOR = "grey";
const PROGRESS_COLOR = "green";
const SIZE = 45;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  greeting: {
    fontSize: 0,
    fontWeight: 'bold',
    margin: 16,
  },
  scrollView: {},
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  updateHeader: {
    flexDirection: 'row',
  },
  header: {
    flex: 1,
    maxHeight:150,
    position: 'relative',
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 20,
    textAlign: 'left',
    alignItems: 'center',
    borderBottomColor: 'black',
    borderBottomWidth: 2,
    borderTopColor: 'black',
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  headerText: {
    flex: 2,
    backgroundColor:'white', 
    color: 'black',
    textAlign: 'center',
    fontSize: 40,
  },
  profileName: {
    fontWeight: 'bold',
    textAlign: 'center'
  },
  body: {
    position: 'relative',
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    justifyContent: 'space-around'
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

  updates: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    fontSize: 15, 
    padding: 20
  },
  snitchContainer: {
  },
});

export default Profile;

