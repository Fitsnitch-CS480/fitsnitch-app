import React, { useContext, useState } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import ClientTrainerService from '../backend/services/ClientTrainerService';
import { globalContext } from '../navigation/appNavigator';
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
const ClientTrainerRequestButton: React.FC<Props> = ({
  profileOwner
}) => {
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

  const {currentUser, clientStore, trainerRequestsForUser, trainerStore} = useContext(globalContext);

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
    let userAsTrainer = await new ClientTrainerService().getTrainerStatus(currentUser,profileOwner);
    let userAsClient = await new ClientTrainerService().getTrainerStatus(profileOwner,currentUser);
    let currentUserTrainer = await new ClientTrainerService().getUserTrainer(currentUser.userId);
    updateState({
      currentUserTrainerId: currentUserTrainer?.userId,
      relationship: {
        userAsClient,
        userAsTrainer
      },
      // any action that sets processing to true will set relationship to null so that
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
    // Only bother updating requests when the currentuser
    // is the trainer because we don't currently have a store
    // for trainer requests FROM the currentuser.
    if (trainer === currentUser) {
      trainerRequestsForUser.fetch()
    }
    updateState({relationship:null})
  }
  
  async function approveClient(trainer:User,client:User) {
    updateState({processing:true})
    await new ClientTrainerService().approveClient(trainer,client)
    // This method is currently only called when the current user is the trainer
    trainerRequestsForUser.fetch()
    clientStore.fetch()
    updateState({relationship:null})
  }

  async function endRelationship(trainer:User,client:User) {
    updateState({processing:true})
    await new ClientTrainerService().removeTrainerFromClient(trainer,client)
    if (trainer === currentUser) {
      // update current users clients
      clientStore.fetch()
    }
    else if (client === currentUser) {
      // update current users trainer
      trainerStore.fetch()
    }
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

export default ClientTrainerRequestButton;