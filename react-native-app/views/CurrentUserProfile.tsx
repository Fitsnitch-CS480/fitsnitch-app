import React, { useContext } from 'react';
import Profile from '../components/Profile';
import { userContext } from '../navigation/mainNavigator';


const CurrentUserProfile: React.FC = () => {
  const {currentUser} = useContext(userContext);
  const feedIds: string[]= [];

  if(currentUser){
    feedIds.push(currentUser.userId);
  }

  if (!currentUser) return <></>

  return (
    <Profile profileOwner={currentUser} feedIds={feedIds}>
    </Profile>
    
  );
};

export default CurrentUserProfile;