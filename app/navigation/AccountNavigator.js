import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import AccountScreen from '../screens/AccountScreen';
import ControleNotificationsScreen from '../screens/ControleNotificationsScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import colors from "../config/colors"
const Stack = createStackNavigator();

const AccountNavigator = () => (
  <Stack.Navigator screenOptions={{
    presentation:"modal",
    headerShown:false,
    }}>
    <Stack.Screen 
      name="My Account" 
      component={AccountScreen} 
      options={{
        title: 'Account',
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: colors.white,
      }}
    />
    <Stack.Screen 
      name="Notifications" 
      component={ControleNotificationsScreen}
    />
    <Stack.Screen 
      name="Profile" 
      component={EditProfileScreen}
    />
  </Stack.Navigator>
)

export default AccountNavigator;