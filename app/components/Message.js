import React, { useState } from 'react'
import { Image, StyleSheet, TouchableHighlight, View } from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons'
import { Audio } from 'expo-av';

import colors from '../config/colors';
import AppText from './AppText';

function Message({msg, image, direction, time, date, sender,type}) {
  const [sound, setSound] = useState(null);
  const handlePress = async() => {
    if (typeof msg !== 'string') return null;
      try {
          const { sound } = await Audio.Sound.createAsync(
              { uri: msg }
          );
          setSound(sound);
          await sound.playAsync();
      } catch (e) {
          console.warn(e);
      }
  }
  return (
    <View style={direction ? styles.message : styles.messageReverse}>
      <View style={direction ? styles.wrapper : styles.wrapperReverse}>
      {sender!=="Expo" && <Image style={direction ? styles.image : styles.img} source={{uri: image}} />}
      {type==="text" && <View style={direction ? styles.info : styles.infoReverse}>
        <AppText style={styles.msg}>{msg}</AppText>
        <View style={styles.dates}>
          <AppText style={styles.date}>{date}</AppText>
          <AppText style={styles.date}>{time}</AppText>
        </View>
      </View>}
      {type==="image" && <View style={direction ? styles.infoImg : styles.infoImgReverse}>
        <Image source={{uri: msg}} style={{width:"100%", height:300, borderRadius:10}}/>
        <View style={styles.dates}>
          <AppText style={styles.date}>{date}</AppText>
          <AppText style={styles.date}>{time}</AppText>
        </View>
      </View>}

      {type==="audio" && <View style={direction ? styles.info : styles.infoReverse}>
      <TouchableHighlight onPress={handlePress} underlayColor={colors.light}>
      <MaterialCommunityIcons name="waveform" size={32} color="white" />
      </TouchableHighlight>
        <View style={styles.dates}>
          <AppText style={styles.date}>{date}</AppText>
          <AppText style={styles.date}>{time}</AppText>
        </View>
      </View>}

      {type==="expo" && <View style={styles.system}>
        <AppText style={styles.expo}>{msg}</AppText>
        <View style={styles.dates}>
          <AppText style={styles.date}>{date}</AppText>
          <AppText style={styles.date}>{time}</AppText>
        </View>
      </View>}
      </View>
    </View>

  )
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection:"row",
    paddingHorizontal: 8,
    paddingVertical:20,
  },
  wrapperReverse: {
    flexDirection:"row-reverse",
    paddingHorizontal: 8,
    paddingVertical:20,
  },
  msg: {
    fontWeight:"500",
    color:colors.white,
  },
  expo: {
    fontWeight:"500",
    color:colors.white,
    fontStyle:"italic",
    textAlign:"center",
  },
  image:{
    width: 42,
    height:42,
    borderRadius: 6,
    marginRight:20,
    borderWidth:2,
    borderColor:colors.medium
  },
  img:{
    width: 42,
    height:42,
    borderRadius: 6,
    marginLeft:20,
    borderWidth:2,
    borderColor:colors.primary

  },
  info:{
    justifyContent:"center",
    maxWidth:"70%",
    minWidth:"30%",
    backgroundColor:colors.medium,
    padding: 10,
    borderRadius:10,
  },
  system:{
    justifyContent:"center",
    width:"100%",
    backgroundColor:colors.danger,
    paddingHorizontal: 10,
    paddingVertical:5,
    borderRadius:10,
  },
  infoImg:{
    justifyContent:"center",
    maxWidth:"90%",
    minWidth:"80%",
    backgroundColor:colors.medium,
    padding: 10,
    borderRadius:10,
  },
  infoReverse:{
    justifyContent:"center",
    maxWidth:"70%",
    minWidth:"30%",
    backgroundColor:colors.primary,
    padding: 10,
    borderRadius:10,
  },
  infoImgReverse:{
    justifyContent:"center",
    maxWidth:"90%",
    minWidth:"80%",
    backgroundColor:colors.primary,
    padding: 10,
    borderRadius:10,
  },
  dates:{
    flexDirection:"row",
    justifyContent:"space-between",
  },

  date:{
    fontSize:10,
    color:colors.xlight,
    marginTop:10,
  }
})

export default Message;