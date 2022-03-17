import React from 'react';
import MainNavigator from './navigation/mainNavigator';
import config from './aws-exports';
import Amplify from '@aws-amplify/core';

Amplify.configure(config);

export default function App(){
  return(
    <MainNavigator/>
  )
}