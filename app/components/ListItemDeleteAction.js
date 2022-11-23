import React from 'react';
import { StyleSheet, View, TouchableWithoutFeedback } from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';

import colors from "../config/colors";


export default function ListItemDeleteAction({onPress}) {
  return (
    <TouchableWithoutFeedback onPress={onPress} style={styles.del}>
      <View style={styles.wrapper}>
        <MaterialCommunityIcons name="trash-can"  size={35} color={colors.white}/>
      </View>
    </TouchableWithoutFeedback>

  )
}

const styles = StyleSheet.create({

  wrapper: {
    backgroundColor:colors.red,
    width:70,
    justifyContent:"center",
    alignItems:"center",
    flex:1,
    elevation:5,
  }
})
