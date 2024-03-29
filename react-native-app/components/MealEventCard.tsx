import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CheatMealEvent from '../shared/models/CheatMealEvent';
import User from '../shared/models/User';
import ProfileImage from './ProfileImage';
import dayjs from 'dayjs';
import { globalContext } from '../views/GlobalContext';
import ServerFacade from '../services/ServerFacade';
import Colors from '../assets/constants/colors';
import { observer } from 'mobx-react-lite';

export type Props = {
  meal: CheatMealEvent;
  user?: User;
};

const CheatMealEventCard = observer<Props>(({
  meal, user
}) => {
  const [mealOwner, setMealOwner] = useState<User|undefined>(undefined)
  const [error, setError] = useState<string>("")

  useEffect(()=>{
    if (user) setMealOwner(user);
    else loadMealOwner();
  }, [])

  async function loadMealOwner() {
    let user = ServerFacade.getUserById(meal.userId)
    if (!user) {
      setError("Could not load meal")
    }
  }


  // function shareMeal(meal:CheatMealEvent) {
  //   new CheatMealService().shareMeal(meal,mealOwner)
  // }

  const {userStore} = useContext(globalContext);
  const currentUser = userStore.currentUser;

  if (error) {
    return <Text>{error}</Text>
  }

  if (!mealOwner) {
    return <Text>Loading...</Text>
  }

  const isUserOwner = meal.userId === currentUser.userId;

  return (
    <View style={styles.container}>
      <ProfileImage user={mealOwner} size={40}></ProfileImage>
      <View style={{marginLeft:10, flexGrow:1}}>
	  	<Text style={[styles.text, styles.header]}>{mealOwner.firstname} {mealOwner.lastname}</Text>
        <View style={styles.details}>
          <View style={styles.detailRow}>
            <View style={styles.detailRowIcon}><Icon name="place" color="#888" size={20}></Icon></View>
            <Text style={styles.text}>{meal.restaurantData.name}</Text>
          </View>
          <View style={styles.detailRow}>
          <View style={styles.detailRowIcon}><Icon name="event" color="#888" size={18}></Icon></View>
		  	<Text style={styles.text}>{getRelativeTime(meal.created_at)}</Text>
          </View>
    
          {/* <View style={styles.shareButton} onTouchEnd={()=>shareMeal(meal)}><Icon name="share" size={20}></Icon></View> */}

        </View>
      </View>
    </View>
  );
});

function getRelativeTime(time:any) {
  if (dayjs().diff(time, 'd') >= 1) {
    return dayjs(time).format('MMM D, YYYY')
  }
  return dayjs(time).fromNow()
}


const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 10,
    width: '100%',
    backgroundColor: Colors.background,
  },
  text: {
    color: Colors.white,
  },
  header: {
    fontSize: 20
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
});

export default CheatMealEventCard;
