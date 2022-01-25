import React, { useContext, useState } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, Button } from 'react-native';
import ClientTrainerService from '../backend/services/ClientTrainerService';
import UserDataService from '../backend/services/UserDataService';
import { userContext } from '../navigation/mainNavigator';
import RelationshipStatus from '../shared/constants/RelationshipStatus';
import User from '../shared/models/User';

type state = {
  processing: boolean,
  currentUserTrainerId: string | null,
  relationship: {
    userAsTrainer?:RelationshipStatus,
    userAsClient?:RelationshipStatus
  } | null
}

export type Props = {
  profileOwner: User;
};
const ProfileClientTrainerButton: React.FC<Props> = ({
  profileOwner
}) => {
  console.log("refresh")
  const [state, setState] = useState<state>({
    processing:false,
    relationship: null,
    currentUserTrainerId: null
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
    let userAsTrainer = await new ClientTrainerService().getTrainerStatus(currentUser,profileOwner);
    let userAsClient = await new ClientTrainerService().getTrainerStatus(profileOwner,currentUser);
    let currentUserTrainerId = await new ClientTrainerService().getUserTrainer(currentUser.userId);
    updateState({
      currentUserTrainerId,
      relationship: {
        userAsClient,
        userAsTrainer
      },
      // any action that sets processing to tru will set relationship to null so that
      // the data is re-fetched. This will then end the processing state.
      processing: false
    })
  }


  async function requestTrainer(trainer:User,client:User) {
    updateState({processing:true})
    await new ClientTrainerService().requestTrainerForClient(trainer,client)
    updateState({relationship:null})
  }

  async function cancelRequest(trainer:User,client:User) {
    updateState({processing:true})
    await new ClientTrainerService().cancelTrainerRequest(trainer,client)
    updateState({relationship:null})
  }
  
  async function approveClient(trainer:User,client:User) {
    updateState({processing:true})
    await new ClientTrainerService().approveClient(trainer,client)
    updateState({relationship:null})
  }

  async function endRelationship(trainer:User,client:User) {
    updateState({processing:true})
    await new ClientTrainerService().removeTrainerFromClient(trainer,client)
    updateState({relationship:null})
  }


  return (
    <>
    {state.relationship.userAsTrainer == RelationshipStatus.APPROVED?
      <View>
        <Text>You are currently training {profileOwner.firstname}</Text>
        <View style={styles.buttonContainer}>
          <Button title="Stop Training" onPress={()=>endRelationship(currentUser,profileOwner)}></Button>
        </View>
      </View>
    :
      <></>
    }
    {state.relationship.userAsTrainer == RelationshipStatus.PENDING?
      <View>
        <Text>{profileOwner.firstname} wants you to be their Trainer!</Text>
        <View style={[styles.buttonContainer, styles.buttonContainerSideBySide]}>
          <View style={styles.mainButton}>
            <Button title={"Train " +profileOwner.firstname}
                    onPress={()=>approveClient(currentUser,profileOwner)}></Button>
          </View>        
          <View style={styles.secondButton}>
            <Button title={"Deny"} color="#888" onPress={()=>cancelRequest(currentUser,profileOwner)}></Button>
          </View>
        </View>
      </View>
    :
      <></>
    }





    {state.relationship.userAsClient == RelationshipStatus.APPROVED?
      <View>
        <Text>{profileOwner.firstname} is your Trainer</Text>
        <Button title="Stop Training" onPress={()=>endRelationship(profileOwner,currentUser)}></Button>
      </View>
    :
      <></>
    }

    {state.relationship.userAsClient == RelationshipStatus.PENDING?
      <View>
        <Text>You've requested {profileOwner.firstname} to be your Trainer</Text>
        <Button title="Cancel Request" onPress={()=>cancelRequest(profileOwner,currentUser)}></Button>
      </View>
    :
      <></>
    }

    {state.relationship.userAsClient == RelationshipStatus.NONEXISTENT && !state.currentUserTrainerId?
      <View>
        <Button title={"Train with "+profileOwner.firstname} onPress={()=>requestTrainer(profileOwner,currentUser)}></Button>
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

export default ProfileClientTrainerButton;