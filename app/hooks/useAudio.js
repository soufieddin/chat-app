import React, { useState, useEffect } from 'react'
import { Audio } from 'expo-av';
import { useAuth } from '../firebase/auth';
import firebase from 'firebase/compat/app';


export const useAudio = () => {
  const [recording, setRecording] = useState();

  const [record, setRecord] = useState(null);
  const [sound, setSound] = useState(null);
  const {user} = useAuth();

  const startRecording = async() =>{
    try{
      console.log('Requesting permissions..');
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      }); 
      console.log('Starting recording..');
      const { recording } = await Audio.Recording.createAsync(
         Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      setRecording(recording);
      console.log('Recording started');
    }catch(err){
      console.error('Failed to start recording', err);
    }
  }

  const stopRecording = async() => {
    console.log('Stopping recording..');
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI(); 
    console.log('Recording stopped and stored at', uri);
    uploadAudio(uri)
  }

  const uploadAudio = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    let ref = firebase.storage().ref().child(`audio/${user.uid}/${Date.now()}`);
    return ref.put(blob).then(
      async (snapshot) => {
        const audioMsg = await snapshot.ref.getDownloadURL();
        console.log("A:",audioMsg);
        setRecord(audioMsg)
      })
      
  }

  async function playSound() {

    if (typeof record !== 'string') return null;

    try {
        const { sound } = await Audio.Sound.createAsync(
            { uri: record }
        );

        setSound(sound);

        await sound.playAsync();
    } catch (e) {
        console.warn(e);
    }

}

useEffect(() => {
    return sound
        ? () => {
          console.log('Unloading Sound');
          sound.unloadAsync(); }
        : undefined;
}, [sound, record]);

return {stopRecording, startRecording, playSound, recording, record}
}