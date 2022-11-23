import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import ChannelsScreen from '../screens/ChannelsScreen';
import GroupeChatScreen from '../screens/GroupeChatScreen';
import CreateChannelScreen from '../screens/CreateChannelScreen';
import PrivateChatScreen from '../screens/PrivateChatScreen';
import colors from "../config/colors"

const Stack = createStackNavigator();

const ChannelsNavigator = () => (
  <Stack.Navigator  screenOptions={{
    presentation:"modal",
    headerShown:false,
    }}
  >
    <Stack.Screen 
      name="Channels" 
      component={ChannelsScreen} 
      options={{
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: colors.white,
      }}
    />
    <Stack.Screen 
      name="GroupeChat" 
      component={GroupeChatScreen}
      options={{
        headerShown:false,
      }}
    />
    <Stack.Screen 
      name="CreateChannel" 
      component={CreateChannelScreen}
      options={{
        headerShown:false,
      }}
    />
   <Stack.Screen 
      name="PrivateChat" 
      component={PrivateChatScreen}
      options={{
        headerShown:false,
      }}
    />
  </Stack.Navigator>
)

export default ChannelsNavigator;