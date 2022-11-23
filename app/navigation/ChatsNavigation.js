import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import ChatsScreen from '../screens/ChatsScreen';
import PrivateChatScreen from '../screens/PrivateChatScreen';
import colors from "../config/colors"

const Stack = createStackNavigator();

const ChatsNavigator = () => (
  <Stack.Navigator  screenOptions={{
    
    presentation:"modal",
    headerShown:false,
    }}
  >
    <Stack.Screen 
      name="Chats" 
      component={ChatsScreen} 
      options={{
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: colors.white,
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

export default ChatsNavigator;