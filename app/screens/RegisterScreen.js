import React, { useState } from 'react';
import { StyleSheet, View, Image } from 'react-native';

import AppForm from '../components/forms/AppForm';
import AppFormField from '../components/forms/AppFormField';
import SubmitButton from '../components/forms/SubmitButton';
import ErrorMessage from '../components/forms/ErrorMessage';
import Screen from '../components/Screen';
import ActivityIndicator from '../components/ActivityIndicator';

import * as Yup from "yup"; 
import colors from '../config/colors';



import {useAuth} from '../firebase/auth'


const validationSchema = Yup.object().shape({
  name: Yup.string().required().min(2).matches(/^\S+$/, 'This field cannot contain blankspaces').label("name"),
  email: Yup.string().required().email().label("email"),
  password: Yup.string().required().min(6).label("password")
})

export default function RegisterScreen() {
  const { signup } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();


  const handleSubmit = async ({name, email, password}) => {
    try {
      setLoading(true)
      await signup(name, email, password);
    } catch(error){
      setLoading(false)
      console.log(error.message);
      setError(error.message)
      
    }
  }
  return (
    <>
      <ActivityIndicator visible={loading} />
      <Screen style={styles.container}>
      <View style={styles.logoWrapper}>
        <Image style={styles.logo} source={require('../assets/lightIcon.png')}/>
      </View>
      <View style={styles.formWrapper}>

      <AppForm
          style={styles.form}
          initialValues={{name:"", email:"", password:""}}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          <ErrorMessage error={error} visible={error} />
          <AppFormField
            autoCorrect={false}
            placeholder="Username"
            name="name"
          />
          <AppFormField
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            placeholder="Email"
            textContentType="emailAddress"
            name="email"
          />
          <AppFormField
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="Password"
            textContentType="password"
            secureTextEntry
            name="password"
          />

          <SubmitButton  text="Register" />
        </AppForm>
      </View>
        
        
      </Screen>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    justifyContent:"center",

  },
  logo:{
    width:200,
    height: 200,
    alignSelf:"center",
    marginBottom:20,

  },
  btn: {
    width: '100%',
    height: 60,
    backgroundColor:colors.primary,
    borderRadius:25,
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
