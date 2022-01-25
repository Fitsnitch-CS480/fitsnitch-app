import React, { useContext } from 'react';
import Profile from '../components/Profile';
import { userContext } from '../navigation/mainNavigator';

const UserProfileView: React.FC = () => {
  const {currentUser} = useContext(userContext);
  if (!currentUser) return <></>

  return (
    <Profile profileOwner={currentUser} />
  );
};

export default UserProfileView;