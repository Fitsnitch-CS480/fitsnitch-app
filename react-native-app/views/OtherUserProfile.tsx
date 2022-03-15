import { useNavigation } from '@react-navigation/native';
import React, { useContext } from 'react';
import Profile from '../components/Profile';
import { globalContext } from '../navigation/appNavigator';

export type props = {
  route: any
}

const OtherUserProfile: React.FC<props> = ({route}) => {
  const {profileOwner} = route.params;
  const {currentUser} = useContext(globalContext);

  if (profileOwner.userId == currentUser.userId) {
    useNavigation<any>().navigate("Profile");
    return null;
  }
  
  return (
    <Profile profileOwner={profileOwner} />
  );
};

export default OtherUserProfile;