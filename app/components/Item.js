import React from 'react'
import { StyleSheet, View, TouchableHighlight, Image, Text } from 'react-native'
import {MaterialCommunityIcons} from '@expo/vector-icons';
import colors from '../config/colors'
import AppText from './AppText'
import {useAuth} from '../firebase/auth';
export default function Item({image, title, messages, status, onPress}) {
  const {user} = useAuth();

  return (
    <TouchableHighlight onPress={onPress} underlayColor={colors.xlight}>
      <View style={styles.wrapper}>
        {image && <Image style={styles.image} source={{uri: image}} />}
        <View style={styles.info}>
          <AppText style={styles.title}>{title}</AppText>
          {/* <AppText style={styles.subtitle}>{subtitle}</AppText> */}
          <AppText style={status === "Online"? styles.status : styles.statusOff}>{status}</AppText>
        </View>
        {messages && <View style={styles.circle}>
          <Text style={styles.quantity}>{messages}</Text>
        </View>}
        
      </View>
    </TouchableHighlight>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection:"row",
   paddingVertical:10,
    backgroundColor:colors.white,
  },
  title: {
    fontWeight:"500",
    color:colors.black,
  },
  subtitle:{
    fontWeight:"400",
    fontSize:16,
    color:colors.silver,
    fontStyle:"italic",
  },
  image:{
    width: 70,
    height: 70,
    borderWidth:2,
    borderColor:colors.primary,
    borderRadius: 10,
  },
  info:{
    marginLeft:16,
    justifyContent:"center"
  },
  circle:{
    justifyContent:"center",
    alignItems: "center",
    backgroundColor:colors.white,
    width: 20,
    height: 20,
    borderRadius:10,
    borderWidth:2,
    borderColor:colors.primary,
    position: 'absolute',
    top: 4,
    left: 57,
    
  },
  circleGreen: {
    backgroundColor:"#55AB55",
    width: 15,
    height: 15,
    borderRadius:7.5,
    borderWidth:0,
    borderColor:colors.primary,
    position: 'absolute',
    top: 4,
    left: 60,
  },
  circleRed: {
    backgroundColor:"#7c0d0e",
    width: 15,
    height: 15,
    borderRadius:7.5,
    borderWidth:0,
    borderColor:colors.primary,
    position: 'absolute',
    top: 4,
    left: 60,
  },
  status:{
    fontSize:14,
    color:"#55AB55",
    fontWeight:"bold",
  },
  statusOff:{
    fontSize:14,
    color:"#7c0d0e",
    fontWeight:"bold",
  },
  quantity:{
    color:colors.danger,
    fontSize:8,
    fontWeight:"700"
  }
})
