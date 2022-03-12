import React, { Component, ReactElement, useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ServerFacade from '../backend/ServerFacade';
import { userContext } from '../navigation/mainNavigator';
import SnitchEvent from '../shared/models/SnitchEvent';
import User from '../shared/models/User';
import ProfileImage from './ProfileImage';
import moment from 'moment';
import SnitchService from '../backend/services/SnitchService';
import PopupMenu from './SnitchOptionsDropdown';

const ICON_SIZE = 24

export type Props = {
  snitch: SnitchEvent;
  user?: User;
};

const SnitchEventCard: React.FC<Props> = ({
  snitch, user, 
}) => {
  const [snitchOwner, setSnitchOwner] = useState<User|undefined>(undefined);
  const [error, setError] = useState<string>("");
  const [visible, setVisible] = useState(false);


  useEffect(()=>{
    if (user) setSnitchOwner(user);
    else loadSnitchOwner();
  }, [])

  async function loadSnitchOwner() {
    let user = ServerFacade.getUserById(snitch.userId)
    if (!user) {
      setError("Could not load Snitch")
    }
  }
  
  const onPopupEvent = (event: any, index:Number) => {
    console.log("Snitch is: ", snitch);
    console.log("index is : ", index);
    if (event !== 'itemSelected') return
    if (index === 0){
        new SnitchService().switchToCheatmeal(snitch);
    }
  }
  
  function shareSnitch(snitch:SnitchEvent) {
    new SnitchService().shareSnitch(snitch,snitchOwner)
  }

  const {currentUser} = useContext(userContext);
  if (!currentUser) return <></>

  if (error) {
    return <Text>{error}</Text>
  }

  if (!snitchOwner) {
    return <Text>Loading...</Text>
  }

  const isUserOwner = snitch.userId === currentUser.userId;

  return (
    <View style={styles.container}>
      <ProfileImage user={snitchOwner} size={40}></ProfileImage>
      <View style={{marginLeft:10, flexGrow:1}}>
        <Text style={{fontSize: 20}}>{snitchOwner.firstname} {snitchOwner.lastname}</Text>
        <View style={styles.details}>
          <View style={styles.detailRow}>
            <View style={styles.detailRowIcon}><Icon name="place" color="#888" size={20}></Icon></View>
            <Text>{snitch.restaurantData.name}</Text>
          </View>
          <View style={styles.detailRow}>
          <View style={styles.detailRowIcon}><Icon name="event" color="#888" size={18}></Icon></View>
            <Text>{getRelativeTime(snitch.created)}</Text>
          </View>
            <View style={styles.snitchToCheatmeal}>
  
            <View style={styles.shareButton} onTouchEnd={()=>shareSnitch(snitch)}><Icon name="share" size={20}></Icon></View>
            <View>
              <PopupMenu actions={['Switch To Cheatmeal']} onPress={onPopupEvent} />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

function getRelativeTime(time:any) {
  if (moment().diff(time, 'd') >= 1) {
    return moment(time).format('MMM D, YYYY')
  }
  return moment(time).fromNow()
}


const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 10,
    width: '100%',
  },
  details: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 10,
    width: '100%',
  },
  detailRow : {
    flexGrow: 1,
    display:'flex',
    flexDirection:'row',
    alignItems: 'center',
    fontSize: 15
  },
  detailRowIcon: {
    marginRight: 5
  },
  shareButton: {
  },
  snitchToCheatmeal: {
    display: 'flex',
    flexDirection: 'row',
    position: 'absolute',
    right: 10, //Vertical: -5   Horizontal: 0
    top: -30,  //Vertical: -35  , Horizontal: -40
  },
});

export default SnitchEventCard;
