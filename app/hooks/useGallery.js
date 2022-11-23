import { useAuth } from '../firebase/auth';
import firebase from 'firebase/compat/app';
import * as ImagePicker from 'expo-image-picker'; 
import React, { useState } from 'react'
import { useFirestoreQuery } from '../firebase/useFirestoreQuery';
import {firestore } from '../firebase/firebase'
import uuid from 'react-native-uuid';


export const useGallery = (ch, typ) => {
  const [img, setImg] = useState(null);
  const [media, setMedia] = useState(null);
  const {user} = useAuth();
  const { data: info } = useFirestoreQuery(firestore.collection('users').doc(user.uid));

  const handleAddMessage = (msg, lastMsg,type, sender=info?.displayName) => {
    if(!msg) return null;
    firestore.collection(typ).doc(ch).collection('messages').add({
      id:uuid.v4(),
      message: msg,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      sender_id : user.uid,
      sender_username: sender,
      sender_image: info?.avatar,
      type:type,
    })
    firestore.collection(typ).doc(ch).update({
      lastMessage: `${info?.displayName}: ${lastMsg.slice(0, 22)}...`
    }) 
}

  const uploadImage = async (uri) => {
    //const response = await fetch(uri);
    //const blob = await response.blob();
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function() {
        resolve(xhr.response);
      };
      xhr.onerror = function() {
        reject(new TypeError('Network request failed'));
      };
      xhr.responseType = 'blob';
      xhr.open('GET', uri, true);
      xhr.send(null);
    });
    let ref = firebase.storage().ref().child(`messages/${user.uid}/${Date.now()}`);
    const snapshot = await ref.put(blob);
    const imageMsg = await snapshot.ref.getDownloadURL();
    blob.close();
    handleAddMessage(imageMsg, "Sent an image", "image");
  }
  
  const handlePress = async() => {
    const uri = await pickImage();
    uploadImage(uri);
    
  }
  const handlePressCam = async() => {
    const uri = await pickImageCam();
    uploadImage(uri);
  }
  const pickImageCam = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.5,
    });
    console.log(result.uri);
    if (!result.cancelled) {
      setMedia(result.uri);
    }
    return result.uri;
  };
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.5,
    });
    console.log(result.uri);
    if (!result.cancelled) {
      setImg(result.uri);
    }
    return result.uri;
  };

  return { handlePress, handlePressCam }
}