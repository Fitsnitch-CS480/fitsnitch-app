import React from 'react';
import MainNavigator from './navigation/mainNavigator';
import config from './aws-exports';
import Amplify from '@aws-amplify/core';
import useLocationTracking from './hooks/useLocationTracking';

Amplify.configure(config);


export default function App(){

  useLocationTracking();

  return(
    <MainNavigator/>
  )
}