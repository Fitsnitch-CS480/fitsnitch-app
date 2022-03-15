import React, { useContext } from 'react';
import Profile from '../components/Profile';
import { globalContext } from '../navigation/appNavigator';


const CurrentUserProfile: React.FC = () => {
  const {currentUser} = useContext(globalContext);

  return (
    <Profile profileOwner={currentUser}>
    </Profile>
    
  );
};

export default CurrentUserProfile;