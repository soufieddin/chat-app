import React from 'react'
import { StyleSheet, View } from 'react-native'
import colors from '../config/colors';
export default function ListLine() {
  return (
    <View style={styles.line} />
  )
}

const styles = StyleSheet.create({
  line:{
    width: "100%",
    height: 1,
    backgroundColor:colors.xlight,
  }
})
