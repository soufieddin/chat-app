import React from 'react'
import { StyleSheet, View, TextInput } from 'react-native'
import {MaterialCommunityIcons} from '@expo/vector-icons'
import defaultStyles from "../../config/styles";
import colors from "../../config/colors";

export default function AppTextInput({icon, ...otherProps}) {
  return (
    <View style={styles.wrapper}>
      {icon && <MaterialCommunityIcons name={icon} size={20} color={colors.medium} style={styles.icon}/>}
      <TextInput style={styles.textInput} {...otherProps}/>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper:{
    backgroundColor:colors.xlight,
    borderRadius:10,
    flexDirection:"row",
    width:"100%",
    padding: 15,
    marginVertical:10   

  },
  textInput: defaultStyles.text,
  icon:{
    marginRight:10,
    marginTop:4
  }
})
