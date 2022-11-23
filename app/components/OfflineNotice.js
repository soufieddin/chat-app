import React from 'react'
import { StyleSheet, View } from 'react-native'
import {useNetInfo} from '@react-native-community/netinfo';

import Constants from 'expo-constants';
import AppText from './AppText'
import colors from '../config/colors';

function OfflineNotice() {
  const netInfo = useNetInfo();
  if(netInfo.type !== "unknown" && netInfo.isInternetReachable === false ) {
    return (
      <View style={styles.container}>
        <AppText style={styles.text}>No Interner Connection!</AppText>
      </View>
    )
  }
  return null;
}

const styles = StyleSheet.create({
  container:{
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    width:"100%",
    position:'absolute',
    backgroundColor: colors.primary,
    elevation: 1,
    top: Constants.statusBarHeight
  },

  text:{
    color: colors.white
  }
})
export default OfflineNotice;