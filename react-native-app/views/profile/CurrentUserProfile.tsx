import { observer } from 'mobx-react-lite';
import React, { useContext } from 'react';
import { globalContext } from '../GlobalContext';
import Profile from './Profile';


const CurrentUserProfile = observer(() => {
	const {userStore} = useContext(globalContext);
	const currentUser = userStore.currentUser;

  return (
    <Profile profileOwner={currentUser} />
  );
});

export default CurrentUserProfile;