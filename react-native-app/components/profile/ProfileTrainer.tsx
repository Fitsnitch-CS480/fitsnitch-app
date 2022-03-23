import React, { ReactNode, useContext, useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { observer } from 'mobx-react-lite';
import { profileContext } from './Profile';
import NameLink from '../NameLink';
import MatIcon from '../MatIcon';
import { globalContext } from '../../navigation/appNavigator';
import ClientTrainerService from '../../backend/services/ClientTrainerService';
import RelationshipStatus from '../../shared/constants/RelationshipStatus';
import User from '../../shared/models/User';
import { MatIconName } from '../MatIconName';
import MatButton from '../MatButton';


type state = {
  processing: boolean,
  relationship: {
    userAsTrainer?:RelationshipStatus,
    userAsClient?:RelationshipStatus
  } | null
}

const ProfileTrainer = observer(() => {
  const {currentUser, clientStore, trainerRequestsForUser, trainerStore} = useContext(globalContext);
  const {profileOwner, profileTrainerStore, isCurrentUser} = useContext(profileContext)
  
  const profileTrainer = profileTrainerStore.data;
  const userIsTrainer = profileTrainer?.userId === currentUser.userId;
  const userIsClient = trainerStore.data?.userId === profileOwner.userId;

  const [state, setState] = useState<state>({
    processing:false,
    relationship: null,
  });

  let flexibleState: state = {...state};
  function updateState(props:Partial<state>) {
    flexibleState = {...flexibleState, ...props};
    setState({...flexibleState})
  }


  if (!state.relationship) {
    loadRelationships(currentUser, profileOwner);
  }

  
  // This component still needs to use the relationship endpoint
  // because that's currently the only way to get the status of
  // a request sent by the current user. In other cases, the data
  // in the stores.
  async function loadRelationships(currentUser:User,profileOwner:User) {
    let userAsTrainer = await new ClientTrainerService().getTrainerStatus(currentUser,profileOwner);
    let userAsClient = await new ClientTrainerService().getTrainerStatus(profileOwner,currentUser);
    updateState({
      relationship: {
        userAsClient,
        userAsTrainer
      },
      // any action that sets processing to true should set relationship to null so that
      // the data is re-fetched. This will then end the processing state.
      processing: false
    })
  }

  async function requestTrainer(trainer:User,client:User) {
    updateState({processing:true})
    await new ClientTrainerService().requestTrainerForClient(trainer,client)
    trainerRequestsForUser.fetch()
    updateState({relationship:null})
  }

  async function cancelRequest(trainer:User,client:User) {
    updateState({processing:true})
    await new ClientTrainerService().cancelTrainerRequest(trainer,client)
    trainerRequestsForUser.fetch()
    updateState({relationship:null})
  }
  
  async function approveClient(trainer:User,client:User) {
    updateState({processing:true})
    await new ClientTrainerService().approveClient(trainer,client)
    trainerRequestsForUser.fetch()
    clientStore.fetch()
    updateState({relationship:null})
  }

  
  function promptEndRelationship(trainer:User,client:User) {
    Alert.alert("Stop Training?",
      `Are you sure you want to stop training ${userIsTrainer ? client.firstname : "with "+trainer.firstname }?`,
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Remove', style: 'destructive', onPress: ()=>endRelationship(trainer,client) }
      ]
    );
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

  const IconRow = (props:{icon:MatIconName, children:ReactNode}) => (
    <View style={styles.rowWrapper}>
        <View style={styles.icon}><MatIcon name={props.icon} size={27} /></View>
        {props.children}
      </View>
  )

  return (
   <>
    { !isCurrentUser && <>

      { userIsTrainer ?
        <IconRow icon="badge">
          <Text style={styles.rowText}>You are {profileOwner.firstname}'s trainer</Text>
          <MatButton title="Stop Training" secondary onPress={()=>promptEndRelationship(currentUser,profileOwner)}></MatButton>
        </IconRow>
      :
      state.relationship?.userAsTrainer == RelationshipStatus.PENDING?
        <IconRow icon="mail">
          <Text style={styles.rowText}>{profileOwner.firstname} wants you to be train them!</Text>
          <MatButton icon="check"
                  onPress={()=>approveClient(currentUser,profileOwner)}></MatButton>
          <MatButton icon="delete" textColor='#444' color='#0000' shadow={false} onPress={()=>cancelRequest(currentUser,profileOwner)}></MatButton>
        </IconRow>
      :
        <></>
      }


      { userIsClient ?
        <IconRow icon="fitness-center">
          <Text style={styles.rowText}>{profileOwner.firstname} is your trainer</Text>
          <MatButton title="Stop Training" secondary onPress={()=>promptEndRelationship(profileOwner,currentUser)}></MatButton>
        </IconRow>
      :
      state.relationship?.userAsClient == RelationshipStatus.PENDING?
        <IconRow icon="mail">
          <Text style={styles.rowText}>Your trainer request is pending</Text>
          <MatButton icon="delete" secondary onPress={()=>cancelRequest(profileOwner,currentUser)}></MatButton>
        </IconRow>
      :
      !state.processing && !trainerStore.data ?
        <IconRow icon="fitness-center">
          <Text style={styles.rowText}>You don't have a trainer yet</Text>
          <MatButton title="Request Trainer" onPress={()=>requestTrainer(profileOwner,currentUser)}></MatButton>
        </IconRow>
      :
        <></>
      }

    </>}





    { isCurrentUser && !trainerStore.data && (
      <IconRow icon="fitness-center">
        <Text style={styles.rowText}>You don't have a trainer yet!</Text>
      </IconRow>
    )}
    { profileTrainer && !userIsTrainer && (
      <IconRow icon="fitness-center">
        <Text style={styles.rowText}>Trainer: <NameLink user={profileTrainer} /></Text>
      </IconRow>
    )}

  </>);
});



const styles = StyleSheet.create({
   rowWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center'
  },
  rowText: {
    marginLeft: 5,
    fontSize: 15,
    flexGrow: 1
  },
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
});

export default ProfileTrainer;
