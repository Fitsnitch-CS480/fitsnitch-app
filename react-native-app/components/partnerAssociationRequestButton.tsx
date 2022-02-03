import React, { useContext, useState } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import PartnerAssociationService from '../backend/services/PartnerAssociationService';
import { userContext } from '../navigation/mainNavigator';
import RelationshipStatus from '../shared/constants/RelationshipStatus';
import User from '../shared/models/User';

type state = {
  processing: boolean,
  // currentUserPartnerId: string | null,
  relationship: {
    userAsPartner1?:RelationshipStatus, //userAsTrainer
    userAsPartner2?:RelationshipStatus //userAsClient
  } | null
}

export type Props = {
  profileOwner: User;
};
const PartnerAssociationRequestButton: React.FC<Props> = ({
  profileOwner
}) => {
  const [state, setState] = useState<state>({
    processing:false,
    relationship: null,
    // currentUserPartnerId: null
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
    let userAsPartner1 = await new PartnerAssociationService().getPartnerStatus(currentUser,profileOwner);
    console.log("", userAsPartner1);
    // let userAsPartner2 = await new PartnerAssociationService().getPartnerStatus(profileOwner,currentUser);
    // let currentUserPartner = await new PartnerAssociationService().getUserPartner(currentUser.userId);
    updateState({
      // currentUserPartnerId: currentUserPartner?.userId,
      relationship: {
        // userAsPartner2,
        userAsPartner1
      },
      // any action that sets processing to true will set relationship to null so that
      // the data is re-fetched. This will then end the processing state.
      processing: false
    })
  }


  async function requestPartner(partner:User,user:User) {
    updateState({processing:true})
    await new PartnerAssociationService().requestPartnerForUser(partner,user)
    updateState({relationship:null})
  }

  async function cancelRequest(partner:User,user:User) {
    updateState({processing:true})
    await new PartnerAssociationService().cancelPartnerRequest(partner,user)
    updateState({relationship:null})
  }
  
  async function approveUser(partner:User,user:User) {
    updateState({processing:true})
    await new PartnerAssociationService().approveUser(partner,user)
    updateState({relationship:null})
  }

  async function endRelationship(partner:User,user:User) {
    updateState({processing:true})
    await new PartnerAssociationService().removePartnerFromUser(partner,user)
    updateState({relationship:null})
  }


  return (
    <>
    {state.relationship.userAsPartner1 == RelationshipStatus.APPROVED?
      <View>
        <Text>You are currently partners {profileOwner.firstname}</Text>
        <View style={styles.buttonContainer}>
          <Button title="Stop being partners with" onPress={()=>endRelationship(currentUser,profileOwner)}></Button>
        </View>
      </View>
    :
      <></>
    }
    {state.relationship.userAsPartner1 == RelationshipStatus.PENDING?
      <View>
        <Text>{profileOwner.firstname} wants you to be their partner!</Text>
        <View style={[styles.buttonContainer, styles.buttonContainerSideBySide]}>
          <View style={styles.mainButton}>
            <Button title={"Partner up with " +profileOwner.firstname}
                    onPress={()=>approveUser(currentUser,profileOwner)}></Button>
          </View>        
          <View style={styles.secondButton}>
            <Button title={"Deny"} color="#888" onPress={()=>cancelRequest(currentUser,profileOwner)}></Button>
          </View>
        </View>
      </View>
    :
      <></>
    }





    {state.relationship.userAsPartner2 == RelationshipStatus.APPROVED?
      <View>
        <Text>{profileOwner.firstname} is your partner</Text>
        <Button title="Stop being partners with" onPress={()=>endRelationship(profileOwner,currentUser)}></Button>
      </View>
    :
      <></>
    }

    {state.relationship.userAsPartner2 == RelationshipStatus.PENDING?
      <View>
        <Text>You've requested {profileOwner.firstname} to be your partner</Text>
        <Button title="Cancel Request" onPress={()=>cancelRequest(profileOwner,currentUser)}></Button>
      </View>
    :
      <></>
    }

    {state.relationship.userAsPartner2 == RelationshipStatus.NONEXISTENT?
      <View>
        <Button title={"Partner up with "+ profileOwner.firstname} onPress={()=>requestPartner(profileOwner,currentUser)}></Button>
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