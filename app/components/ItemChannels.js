import React from 'react'
import { StyleSheet, View, TouchableHighlight, Image, Text } from 'react-native'
import Swipeable from 'react-native-gesture-handler/Swipeable';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import colors from '../config/colors'
import AppText from './AppText'
import {useAuth} from '../firebase/auth';
export default function Item({image, title, subtitle, renderRightActions, favo, members, messages, onPress, handlePress}) {
  const {user} = useAuth();

  return (
    <Swipeable renderRightActions={renderRightActions}>
    <TouchableHighlight onPress={onPress} underlayColor={colors.xlight}>
      <View style={styles.channel}>
        <View style={styles.wrapper}>
          {image && <Image style={styles.image} source={{uri: image}} />}
          <View style={styles.info}>
            <AppText style={styles.title}>{title}</AppText>
            <AppText style={styles.subtitle}>{subtitle}</AppText>
          </View>
          {messages && <View style={styles.circle}>
            <Text style={styles.quantity}>{messages}</Text>
          </View>}
          
        </View>
        
        {favo ? (<MaterialCommunityIcons name="heart" size={24} color={colors.primary} onPress={handlePress}/>) : (<MaterialCommunityIcons name="heart-outline" size={24} color={colors.primary} onPress={handlePress}/>)}
      </View>

    </TouchableHighlight>
  </Swipeable>
    
  )
}

const styles = StyleSheet.create({
  channel:{
    flexDirection:"row",
    justifyContent:"space-between",
    alignItems:"center",
  },
  wrapper: {
    flexDirection:"row",
    paddingVertical: 10,
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
  quantity:{
    color:colors.danger,
    fontSize:8,
    fontWeight:"700"
  }
})
