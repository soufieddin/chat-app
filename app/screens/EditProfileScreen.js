import React, {useState} from 'react'
import { StyleSheet, Image, ScrollView,View, TouchableWithoutFeedback, Alert } from 'react-native'
import AppForm from '../components/forms/AppForm';
import AppFormField from '../components/forms/AppFormField';
import SubmitButton from '../components/forms/SubmitButton';
import ErrorMessage from '../components/forms/ErrorMessage';
import Screen from '../components/Screen';
import ActivityIndicator from '../components/ActivityIndicator';
import * as Yup from "yup"; 
import * as ImagePicker from 'expo-image-picker'; 
import {MaterialCommunityIcons} from '@expo/vector-icons'
import colors from '../config/colors';
import {useFirestoreQuery} from '../firebase/useFirestoreQuery';
import { useAuth } from '../firebase/auth';
import {firestore, storage } from '../firebase/firebase'
import firebase from 'firebase/compat/app';
import routes from "../navigation/routes"


const validationSchema = Yup.object().shape({
  username: Yup.string().min(2).matches(/^\S+$/, 'This field cannot contain blankspaces').label("name"),
  email: Yup.string().email().label("email"),
  password: Yup.string().min(6).label("password"),
  firstname: Yup.string().min(2),
  lastname: Yup.string().min(2),
  address: Yup.string(),
  zipCode:Yup.string(),
  age:Yup.string(),
})

export default function EditProfileScreen({ navigation }) {
  const {user} = useAuth();
  const { data: info } = useFirestoreQuery(firestore.collection('users').doc(user.uid));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [img, setImg] = useState();
  console.log(user)
  const handlePress = () => {
    if(!img) {
      Alert.alert('Update Avatar', 'Are you sure you want to change this image?', [
        {text: "Yes", onPress: () => pickImage()},
        {text: "No"}
      ])
    };
  }
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.5,
    });

    console.log(result);

    if (!result.cancelled) {
      setImg(result.uri);
    }
  };

  const uploadImage = async () => {
    const response = await fetch(img);
    const blob = await response.blob();
    let ref = firebase.storage().ref().child(`images/${user.uid}/avatar`);
    return ref.put(blob);
  }

  const handleSubmit = async({username, email, password, firstname, lastname, address, zipCode, age}) => {
    try {
      setLoading(true)
      if(img){
        await uploadImage();
          const avatar = await storage.ref(`images/${user.uid}/avatar`).getDownloadURL();
          await firestore.collection('users').doc(user.uid).update({
            avatar: avatar,
        })

      }
       await firestore.collection('users').doc(user.uid).update({
        displayName: username !== "" ? `@${username}` : info.displayName,  
        firstName: firstname !== "" ? firstname : info.firstName,  
        lastName: lastname !== "" ? lastname : info.lastName, 
        address: address !== "" ? address : info.address,  
        zipCode: zipCode !== "" ? zipCode : info.zipCode, 
        age: age !== "" ? age : info.age,
      })

      await user.updateProfile(username !== "" ? `@${username}`: info.displayName)
      
      await user.updateEmail(email !== "" ? email : info.email)
      await user.updatePassword(password !== "" ? password : user.password)

      setLoading(false)
      navigation.navigate("My Account")

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
        <ScrollView>
        <AppForm
          style={styles.form}
          initialValues={{username:`${info?.displayName ? info?.displayName : ""}`, email:"", password:"", firstname:"", lastname:"", address:"", zipCode:"", age:""}}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          <ErrorMessage error={error} visible={error} />
          <TouchableWithoutFeedback onPress={handlePress} name="avatarImage">
            <View style={styles. imagePic}>
              { !img && ( <Image source={{ uri:info?.avatar }} style={{ width: 100, height: 100, borderRadius:14 }}/> ) }
              { img && ( <Image source={{ uri:img }} style={{ width: 100, height: 100, borderRadius:14 }}/> ) }
            </View>
          </TouchableWithoutFeedback>
          <AppFormField
            autoCorrect={false}
            placeholder={info?.displayName ? info?.displayName : "Username"}
            name="username"
          />
           <AppFormField
            autoCorrect={false}
            placeholder={info?.firstName ? info?.firstName : "First Name"}
            name="firstname"
          />
          <AppFormField
            autoCorrect={false}
            placeholder={info?.lastName ? info?.lastName : "Last Name"}
            name="lastname"
          />
          <AppFormField
            autoCorrect={false}
            placeholder={info?.address ? info?.address : "Address"}
            name="address"
          />
          <AppFormField
            autoCorrect={false}
            placeholder={info?.zipCode ? info?.zipCode : "Zipcode"}
            name="zipCode"
          />
          <AppFormField
            autoCorrect={false}
            placeholder={info?.age ? info?.age : "Age"}
            name="age"
          />
          <AppFormField
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            placeholder={info?.email ? info?.email : "Email"}
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

          <SubmitButton  text="Update" />
        </AppForm>
        </ScrollView>
      </Screen>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    justifyContent:"center",

  },
  imagePic:{
    width:100,
    height: 100,
    borderRadius: 14,
    backgroundColor:colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical:10,
    alignSelf:"center",
  }
})
