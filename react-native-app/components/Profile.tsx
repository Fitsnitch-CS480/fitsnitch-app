import React, { useContext, useState } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import ClientTrainerService from '../backend/services/ClientTrainerService';
import PartnerAssociationService from '../backend/services/PartnerAssociationService';
import SnitchService from '../backend/services/SnitchService';
import CheatMealService from '../backend/services/CheatMealService';
import { userContext } from '../navigation/mainNavigator';
import RelationshipStatus from '../shared/constants/RelationshipStatus';
import CheatMealEvent from '../shared/models/CheatMealEvent';
import { UserCheatMealResponse } from '../shared/models/requests/UserCheatMealRequest';
import { UserSnitchesResponse } from '../shared/models/requests/UserSnitchesRequest';
import SnitchEvent from '../shared/models/SnitchEvent';
import User from '../shared/models/User';
import ClientTrainerRequestButton from './ClientTrainerRequestButton';
import CheatMealEventCard from './MealEventCard';
import PaginatedList from './PaginatedList';
import PartnerAssociationRequestButton from './PartnerAssociationRequestButton';
import ProfileImage from './ProfileImage';
import SnitchEventCard from './SnitchEventCard';
import CheatMealSchedule from './CheatMealSchedule';


const PAGE_SIZE = 10

type state = {
  partnerRelationship?: RelationshipStatus,
  trainerRelationship?: RelationshipStatus,
}

export type Props = {
  profileOwner: User;
};

const Profile: React.FC<Props> = ({
  profileOwner,
}) => {

  const [state, setState] = useState<state>({
    trainerRelationship: undefined,
    partnerRelationship: undefined,
  });

  const {currentUser} = useContext(userContext);
  if (!currentUser) return <></>

  // HACK: these are for development only and should be removed or commented before submitting a PR!!!
  // let testArthurUser = {email: "", userId: "833b9875-e922-45b4-a2c3-c34efdbc3367", firstname:"Arthur",lastname:"Test"}
  // let testFitSnitchUser = {email: "fitsnitchdev@gmail.com", userId: "81885d13-1288-4298-ab5d-eaf85d9b2594", firstname:"FitSnitch", lastname:"Test"}
  // profileOwner = testFitSnitchUser

  const isCurrentUser = profileOwner.userId === currentUser.userId;


  if (!state.trainerRelationship ) {
    loadRelationships(currentUser, profileOwner);
    // if (!state.processing) return <></>
    // else return <Button title="Processing..."></Button>
  }

  async function loadRelationships(currentUser:User,profileOwner:User) {
    let userAsTrainer = await new ClientTrainerService().getTrainerStatus(currentUser,profileOwner);
    let partnership = await new PartnerAssociationService().getPartnerStatus(currentUser,profileOwner);
    
    setState({
      trainerRelationship: userAsTrainer,
      partnerRelationship: partnership.status
    })

  }

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
          {/* <Image
              source={{
                uri:
                  'https://raw.githubusercontent.com/AboutReact/sampleresource/master/old_logo.png',
              }}
              //borderRadius will help to make Round Shape
              style={{
                width: 75,
                height: 75,
                borderRadius: 200 / 2,
              }}
            /> */}
          <Text style={styles.headerText}>{profileOwner.firstname || "Test"} {profileOwner.lastname || ""}</Text>
        </View>

        <ScrollView style={styles.scrollView}>
          <View style={{}}>
            <View style={[styles.body]}>

              {!isCurrentUser ?
              <View>
                <View style={{paddingBottom: 5}}>
                  <ClientTrainerRequestButton profileOwner={profileOwner}></ClientTrainerRequestButton>
                </View>
                <View style={{paddingTop : 5}}>
                  <PartnerAssociationRequestButton profileOwner={profileOwner}></PartnerAssociationRequestButton>
                </View>
              </View>
              : <></>}

              {state.trainerRelationship ?
              <View>
                <View style={{paddingBottom: 5}}>
                  <CheatMealSchedule profileOwner={profileOwner}></CheatMealSchedule>
                </View>
              </View>
              : <></>}

              <Text style={{fontSize: 15, paddingBottom: 5}}>
                5 Partners: Chef Rush, +4
              </Text>
              <View style={[styles.rowContainer, {justifyContent: 'space-around'}]}>
                <View style={{flex: 1}}>
                  <Text style={{fontSize: 17, fontWeight: 'bold'}}>
                      Goals
                  </Text>
                </View>
                <View>
                  <Text>
                    Edit
                  </Text>
                </View>
              </View>
              <View style={[styles.rowContainer, {padding: 10, backgroundColor: 'lightgrey'}]}>
                <View style={styles.progressCircle}/>
                <View style={styles.progressCircle}/>
                <View style={styles.progressCircle}/>
                <View style={styles.progressCircle}/>
              </View>


              <View style={styles.rowContainer}>
                <View style={{flex: 1}}>
                  <Text style={{fontSize: 17, fontWeight: 'bold', paddingTop: 10}}>
                      Plan
                  </Text>
                </View>
                <View style={{}}>
                  <Text>
                    Edit
                  </Text>
                </View>
              </View>
              <View style={[styles.rowContainer, {backgroundColor: 'lightgrey'}]}>
                <Text style={{fontSize: 15, padding: 20}}>Update your Plan</Text>
              </View>

              {currentUser === profileOwner || state.trainerRelationship === RelationshipStatus.APPROVED || state.partnerRelationship === RelationshipStatus.APPROVED?
            
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

            {currentUser === profileOwner || state.trainerRelationship === RelationshipStatus.APPROVED || state.partnerRelationship === RelationshipStatus.APPROVED?
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
                        <SnitchEventCard snitch={snitch} user={profileOwner}></SnitchEventCard>
                      </View>
                    ))}
                  />
                </View>
                <View style={{}}>
                  <Text>
                    Edit
                  </Text>
                </View>
              </View>
            :<></>}

            </View>
          </View>
        </ScrollView>
      </ScrollView>
    </View>
  );
};



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

