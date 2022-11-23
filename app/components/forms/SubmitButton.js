import React from 'react'
import { StyleSheet } from 'react-native'
import {useFormikContext} from 'formik'
import Button from '../Button';
import colors from "../../config/colors";

export default function SubmitButton({text}) {
  const { handleSubmit } = useFormikContext(); 
  return (
    <Button styleBtn={styles.btn} text={text} styleText={styles.text} onPress={handleSubmit}/>

  )
}

const styles = StyleSheet.create({
  btn: {
    width: '100%',
    height: 60,
    backgroundColor:colors.primary,
    borderRadius:10,
    justifyContent:"center",
    alignItems:"center",
    padding: 15,
    marginVertical:10,
  },
  text:{
    color: colors.white,
    fontSize:18,
    textTransform:"uppercase",
    fontWeight:"bold",
  },
})
