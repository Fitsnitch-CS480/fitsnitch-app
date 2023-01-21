import React, { useContext } from 'react';
import { globalContext } from '../appNavigator';
import Profile from './Profile';


const CurrentUserProfile: React.FC = () => {
  const {currentUser} = useContext(globalContext);

  return (
    <Profile profileOwner={currentUser} />
  );
};

export default CurrentUserProfile;