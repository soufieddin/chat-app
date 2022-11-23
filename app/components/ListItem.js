import React from 'react'
import { Image, StyleSheet, View, TouchableHighlight } from 'react-native';

import colors from '../config/colors';
import AppText from './AppText';

function ListItem({title, IconComponent, image, onPress}) {
  return (
    <TouchableHighlight onPress={onPress} underlayColor={colors.xlight}>
      <View style={styles.wrapper}>
        {IconComponent}
        {image && <Image style={styles.image} source={{uri: image}} />} 
        <View style={styles.info}>
          <AppText style={styles.title}>{title}</AppText>
        </View>
      </View>
    </TouchableHighlight>

  )
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection:"row",
    padding: 8,
    backgroundColor:colors.white
  },
  title: {
    fontWeight:"500",
  },
  image:{
    width: 70,
    height: 70,
    borderRadius: 10,
  },
  info:{
    justifyContent:"center",
    marginLeft:20
  }
})

export default ListItem;