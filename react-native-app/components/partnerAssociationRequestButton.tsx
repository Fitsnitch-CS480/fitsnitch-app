import React, { useContext, useState } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import PartnerAssociationService from '../backend/services/PartnerAssociationService';
import { userContext } from '../navigation/mainNavigator';
import RelationshipStatus from '../shared/constants/RelationshipStatus';
import { PartnerStatusResponse } from '../shared/models/requests/PartnerStatusResponse';
import User from '../shared/models/User';

type state = {
  processing: boolean,
  relationship?: PartnerStatusResponse
  requestee?: User
  requester?: User
}

export type Props = {
  profileOwner: User;
};
const PartnerAssociationRequestButton: React.FC<Props> = ({
  profileOwner
}) => {
  const [state, setState] = useState<state>({
    processing:false,
    relationship: undefined,
    requestee: undefined,
    requester: undefined
  });

  let flexibleState: state = {...state};
  function updateState(props:Partial<state>) {
    flexibleState = {...flexibleState, ...props};
    setState({...flexibleState})
  }

  const {currentUser} = useContext(userContext);
  if (!currentUser) return <></>

  if (!state.relationship) {
    loadRelationships(currentUser, profileOwner);
    if (!state.processing) return <></>
    else return <Button title="Processing..."></Button>
  }

  if (state.processing) {
    return <Button title="Processing..."></Button>
  }

  async function loadRelationships(currentUser:User,profileOwner:User) {
    console.log("hit loadrelationship");
    let partnership = await new PartnerAssociationService().getPartnerStatus(currentUser,profileOwner);
    console.log("partnership: ", partnership);

    updateState({
      relationship: partnership,
      processing: false,
    })
  }

  async function requestPartner(user:User,profileUser:User) {
    updateState({processing:true, requester: user, requestee: profileUser})
    console.log("hit before")
    await new PartnerAssociationService().requestPartnerForUser(user,profileUser)
    console.log("hit after")
    updateState({relationship:undefined})
  }

  async function cancelRequest(user:User,profileUser:User) {
    updateState({processing:true, requester: undefined, requestee: undefined})
    await new PartnerAssociationService().cancelPartnerRequest(user,profileUser)
    updateState({relationship:undefined})
  }
  
  async function approveUser(user:User,profileUser:User) {
    updateState({processing:true, requester: undefined, requestee: undefined})
    await new PartnerAssociationService().approveUser(user,profileUser)
    updateState({relationship:undefined})
  }

  async function endRelationship(user:User,profileUser:User) {
    updateState({processing:true, requester: undefined, requestee: undefined})
    await new PartnerAssociationService().removePartnerFromUser(user,profileUser)
    updateState({relationship:undefined})
  }

  return (
    <>

    {state.relationship.status == RelationshipStatus.APPROVED?
      <View>
        <Text>{profileOwner.firstname} is your partner</Text>
        <Button title="Stop being partners with" onPress={()=>endRelationship(profileOwner,currentUser)}></Button>
      </View>
    :
      <></>
    }

    {state.relationship.status == RelationshipStatus.PENDING && currentUser == state.requestee?
      <View>
        <Text>You've requested {profileOwner.firstname} to be your partner</Text>
        <Button title="Cancel Request" onPress={()=>cancelRequest(profileOwner,currentUser)}></Button>
      </View>
    :
      <></>
    }

{state.relationship.status == RelationshipStatus.PENDING && currentUser == state.requestee?
      <View>
        <Text>{profileOwner.firstname} wants you to be their partner!</Text>
        <Button title="Cancel Request" onPress={()=>cancelRequest(profileOwner,currentUser)}></Button>
        <Button title="Approve Request" onPress={()=>approveUser(profileOwner,currentUser)}></Button>
      </View>
    :
      <></>
    }

    {state.relationship.status == RelationshipStatus.NONEXISTENT?
      <View>
        <Button title={"Partner up with "+ profileOwner.firstname} onPress={()=>requestPartner(profileOwner, currentUser)}></Button>
      </View>
    :
      <></>
    }

    </>
  );
};

const styles = StyleSheet.create({
  buttonContainerSideBySide: {
    display: 'flex',
    flexDirection: 'row',
  },
  buttonContainer: {
    marginBottom: 5
  },
  mainButton: {
    flexGrow: 2
  },
  secondButton: {
    flexGrow: 1,
  }
})

export default PartnerAssociationRequestButton;