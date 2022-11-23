import React from 'react'
import { StyleSheet, View, TouchableHighlight, Image } from 'react-native'
import colors from '../config/colors'
import AppText from './AppText'
import {useFirestoreQuery} from '../firebase/useFirestoreQuery'
import {firestore} from '../firebase/firebase'

export default function Members({ onPress,userId }) {

  const { data: info } = useFirestoreQuery(firestore.collection('users').doc(userId));

  return (
    <TouchableHighlight onPress={onPress} underlayColor={colors.xlight}>
      <View style={styles.wrapper}>
        {info?.avatar&& <Image style={info?.status === "Online" ? styles.image : styles.img} source={{uri: info?.avatar}} />}
        <AppText style={styles.title}>{info?.displayName}</AppText>
      </View>
    </TouchableHighlight>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    marginRight:15,
  },
  title: {
    fontWeight:"500",
    color:colors.primary,
    fontSize:12,
    marginTop:2,
  },
  image:{
    width: 50,
    height: 50,
    borderWidth:2,
    borderColor:colors.green,
    borderRadius: 7,
  },
  img:{
    width: 50,
    height: 50,
    borderWidth:2,
    borderColor:colors.red,
    borderRadius: 7,
  },
})
