import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import React, { useContext } from 'react';
import { globalContext } from '../GlobalContext';
import Profile from './Profile';

export type props = {
  route: any
}

const OtherUserProfile = observer<props>(({route}) => {
  const {profileOwner} = route.params;
  const {userStore} = useContext(globalContext);
  const currentUser = userStore.currentUser;

  if (profileOwner.userId == currentUser.userId) {
    useNavigation<any>().navigate("Profile");
    return null;
  }
  
  return (
    <Profile profileOwner={profileOwner} />
  );
});

export default OtherUserProfile;