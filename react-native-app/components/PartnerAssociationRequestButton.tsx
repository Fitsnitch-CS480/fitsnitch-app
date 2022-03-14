import { observer } from 'mobx-react-lite';
import React, { useContext, useState } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import PartnerAssociationService from '../backend/services/PartnerAssociationService';
import { globalContext } from '../navigation/appNavigator';
import RelationshipStatus from '../shared/constants/RelationshipStatus';
import PartnerStatusResponse from '../shared/models/requests/PartnerStatusResponse';
import User from '../shared/models/User';

type state = {
  processing: boolean,
  relationship?: PartnerStatusResponse
}

export type Props = {
  profileOwner: User;
};
const PartnerAssociationRequestButton = observer(({profileOwner}:Props) => {
  const [state, setState] = useState<state>({
    processing:false,
    relationship: undefined,
  });

  let flexibleState: state = {...state};
  function updateState(props:Partial<state>) {
    flexibleState = {...flexibleState, ...props};
    setState({...flexibleState})
  }

  const {currentUser, partnerStore, partnerRequestsForUser} = useContext(globalContext);

  if (!state.relationship) {
    loadRelationships(currentUser, profileOwner);
    if (!state.processing) return <></>
    else return <Button title="Processing..." onPress={()=>{}}></Button>
  }

  if (state.processing) {
    return <Button title="Processing..." onPress={()=>{}}></Button>
  }

  // This component still needs to use the relationship endpoint
  // because that's currently the only way to get the status of
  // a request sent by the current user. In other cases, the data
  // in the stores.
  async function loadRelationships(currentUser:User,profileOwner:User) {
    console.log("hit loadrelationship");
    let partnership = await new PartnerAssociationService().getPartnerStatus(currentUser,profileOwner);

    updateState({
      relationship: partnership,
      processing: false,
    })
  }

  async function requestPartner(requester:User,requestee:User) {
    updateState({processing:true})
    console.log("hit before")
    await new PartnerAssociationService().requestPartnerForUser(requester,requestee)
    console.log("hit after")
    updateState({relationship:undefined})
  }

  async function cancelRequest(requester:User,requestee:User) {
    updateState({processing:true})
    await new PartnerAssociationService().deleteRequest(requester,requestee)
    // Only bother fetching new requests when the currentuser
    // is the requestee because we don't currently have a store
    // for partner requests FROM the currentuser.
    if (requestee === currentUser) {
      partnerRequestsForUser.fetch()
    }
    updateState({relationship:undefined})
  }
  
  async function approveUser(requester:User,requestee:User) {
    updateState({processing:true})
    await new PartnerAssociationService().approveRequest(requester,requestee)
    partnerStore.fetch();
    updateState({relationship:undefined})
  }

  async function endRelationship(partner:User,user:User) {
    updateState({processing:true})
    await new PartnerAssociationService().removePartnerFromUser(partner,user)
    partnerStore.fetch();
    updateState({relationship:undefined})
  }

  return (
    <>

    {state.relationship.status == RelationshipStatus.APPROVED?
      <View>
        <Text>{profileOwner.firstname} is your partner</Text>
        <Button title="End Partnership" onPress={()=>endRelationship(profileOwner,currentUser)}></Button>
      </View>
    :
      <></>
    }

    {state.relationship.status == RelationshipStatus.PENDING && currentUser.userId == state.relationship.request?.requester?
      <View>
        <Text>You've requested {profileOwner.firstname} to be your partner</Text>
        <Button title="Cancel Request" onPress={()=>cancelRequest(currentUser,profileOwner)}></Button>
      </View>
    :
      <></>
    }

    {state.relationship.status == RelationshipStatus.PENDING && currentUser.userId == state.relationship.request?.requestee?
      <View>
        <Text>{profileOwner.firstname} wants you to be their partner!</Text>
        <View style={[styles.buttonContainer, styles.buttonContainerSideBySide]}>
          <View style={styles.mainButton}>
            <Button title={"Accept"} onPress={()=>approveUser(profileOwner,currentUser)}></Button>
          </View>
          <View style={styles.secondButton}>
            <Button title={"Deny"} color="red" onPress={()=>cancelRequest(profileOwner,currentUser)}></Button>
          </View>
        </View>
      </View>
    :
      <></>
    }

    {state.relationship.status == RelationshipStatus.NONEXISTENT?
      <View>
        <Button title={"Partner up with "+ profileOwner.firstname} onPress={()=>requestPartner(currentUser, profileOwner)}></Button>
      </View>
    :
      <></>
    }

    </>
  );
});

const styles = StyleSheet.create({
  buttonContainerSideBySide: {
    display: 'flex',
    flexDirection: 'row',
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  mainButton: {
    flexGrow: 2,
    width: '50%'
  },
  secondButton: {
    flexGrow: 1,
    width: '50%'
  }
})

export default PartnerAssociationRequestButton;