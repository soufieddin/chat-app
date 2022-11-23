import React from 'react'
import { View } from 'react-native'
import {MaterialCommunityIcons} from '@expo/vector-icons'
export default function Icon({
  name,
  size = 60 ,
  backgroundColor = "#000",
  iconColor = "#fff"
}) {
  return (
    <View style={{
      width: 70,
      height: 70,
      borderRadius:10,
      backgroundColor,
      justifyContent:"center",
      alignItems:"center"
    }}>
      <MaterialCommunityIcons name={name} size={size*0.5} color={iconColor} />
    </View>
  )
}


