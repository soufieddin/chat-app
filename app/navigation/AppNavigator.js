import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {MaterialCommunityIcons} from '@expo/vector-icons'

import ChannelsNavigation from './ChannelsNavigation';
import ChatsNavigation from './ChatsNavigation';
import AccountNavigator from './AccountNavigator'

//import useNotifications from '../hooks/useNotifications';

const Tab = createBottomTabNavigator();


const AppNavigator = () => {
  //useNotifications( (notification) => navigate("Account") );
 
  return (
    <Tab.Navigator>
      <Tab.Screen 
        name="Groups" 
        component={ChannelsNavigation}
        options={{
          headerShown:false,
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons name="account-group" size={size} color={color}/>
          )
        }}
      />

      <Tab.Screen 
        name="Users" 
        component={ChatsNavigation}
        options={{
          headerShown:false,
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons name="chat" size={size} color={color}/>
          )
        }}
      />

      <Tab.Screen 
        name="Account" 
        component={AccountNavigator}
        options={{
          headerShown:false,
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons name="account" size={size} color={color}/>
          )
        }}
      />
    </Tab.Navigator>
  )
}



export default AppNavigator;