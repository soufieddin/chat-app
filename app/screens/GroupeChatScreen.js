import React, { useState } from 'react'
import { StyleSheet, View, FlatList, TextInput, Platform, StatusBar, Alert, Text } from 'react-native'

import { useAuth } from '../firebase/auth';
import colors from '../config/colors'
import Members from '../components/Members';
import routes from "../navigation/routes"
import {firestore } from '../firebase/firebase'
import { useFirestoreQuery } from '../firebase/useFirestoreQuery';
import { useGallery } from '../hooks/useGallery';
import { useAudio } from '../hooks/useAudio';

import {MaterialCommunityIcons} from '@expo/vector-icons'
import ListLine from '../components/ListLine';
import Message from '../components/Message';
import useLocation from '../hooks/useLocation'
import { BottomSheet } from 'react-native-btr';
import Button from '../components/Button';
import {useMessage} from '../hooks/useMessage'





export default function GroupeChatScreen({ route, navigation }) {
  const location = useLocation();
  const {user} = useAuth();
  const channel = route.params;
  const [extraMenu, setExtraMenu] = useState(false);
  const [textMsg, setTextMsg] = useState("");
  const { data } = useFirestoreQuery(firestore.collection('channels').doc(channel.id));
  const members = data?.members;
  const contacts = members?.filter(member => member.id !== user.uid)
  const { data: messages } = useFirestoreQuery(firestore.collection('channels').doc(channel.id).collection("messages").orderBy('timestamp', 'desc'));
  const [visible, setVisible] = useState(false);
  const {handlePress, handlePressCam} = useGallery(channel.id, "channels");
  const {stopRecording, startRecording, playSound, recording, record} = useAudio();
  const {handleAddMessage} = useMessage(channel.id, "channels");

  const toggleBottomNavigationView = () => {
    //Toggling the visibility state of the bottom sheet
    setVisible(!visible);
  };
  return (
    <>
    <BottomSheet
          visible={visible}
          onBackButtonPress={toggleBottomNavigationView}
          onBackdropPress={toggleBottomNavigationView}
        >
           <View style={styles.bottomNavigationView}>

            <Text style={styles.createLabel}>Voice Message</Text>
            <Button styleBtn={styles.createBtn} text={recording ? "Stop" : "Record"} color={recording ? "red" : "green"} styleText={styles.createTex} onPress={recording ? stopRecording : startRecording}/>
            <Button styleBtn={styles.createBtn} text="Replay" color="silver" styleText={styles.createTex} onPress={playSound}/>
            <Button styleBtn={styles.createBtn} text="Send" color="medium" styleText={styles.createTex} onPress={()=>{
              handleAddMessage(record, `${user.displayName}: sent an audio message`, "audio");
              setVisible(false);
            }}/>

           </View>
        </BottomSheet>
      <View style={styles.members}>
        <FlatList 
          data={contacts}
          style={styles.list}
          keyExtractor={member => member.id}
          horizontal={true}
          showsHorizontalScrollIndicator={true}
          renderItem={({item})=>
            <Members 
              userId={item.id}
              onPress={ async()=> {
                  const chatId = [user.uid, item.id].sort().join("_");
                  await firestore.collection('chats').doc(chatId).set({
                    lastMessage:"Last message",
                    messages:[]
                  })
                  navigation.navigate(routes.PRIVATE_CHAT_SCREEN, item)
                  setEnter(true);
                }}
                
                />
              }
              />
      </View>
      <View style={styles.main}>
        <FlatList
        inverted
        data={messages}
        style={styles.msgList}
        keyExtractor={item => item.id}
        renderItem={({item})=>
      <Message 
      msg={item.message}
      image={item.sender_image}
      sender={item.sender_username}
      direction={user.uid === item.sender_id ? false : true}
      time={new Date(item.timestamp?.seconds *1000).toLocaleTimeString()}
      date={new Date(item.timestamp?.seconds *1000).toLocaleDateString()}
      type={item.type}
      />
      }
      
      />
      </View>
      <View style={styles.control}>
        <View style={styles.send}>
      <TextInput
          multiline
          placeholder="Enter Message Here"
          placeholderTextColor={colors.silver}
          style={styles.search}
          onChangeText={setTextMsg}
          value={textMsg}
        />
        <MaterialCommunityIcons name="send" size={24} color={colors.primary} onPress={async()=>{await handleAddMessage(textMsg, `${user.displayName}: ${textMsg}`, "text"); setTextMsg("")}}/>

        </View>
        <MaterialCommunityIcons name="unfold-more-horizontal" size={32} color={colors.primary} onPress={()=> setExtraMenu(!extraMenu)}/>


      </View>
      {extraMenu && 
      <View style={styles.extra}>
          <MaterialCommunityIcons name="microphone" size={32} color={colors.primary} onPress={()=>setVisible(true)} />
          <ListLine/>
          <MaterialCommunityIcons style={styles.extraIcon} name="map-marker" size={32} color={colors.primary} onPress={()=> {
            Alert.alert('Alert', 'Are you sure you want to send your current location', [
              {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
              }, 
              { text: 'Confirm', onPress: () => {
                handleAddMessage(location, `${user.displayName}: Sent Location`, "text");
                setExtraMenu(false)
              } },
            ]);
            
            
          }}/>
          <ListLine/>
          <MaterialCommunityIcons style={styles.extraIcon} name="camera" size={32} color={colors.primary} onPress={()=> handlePressCam()}/>
          <ListLine/>
          <MaterialCommunityIcons style={styles.extraIcon} name="image" size={32} color={colors.primary} onPress={()=> handlePress()}/>
          <ListLine/>
          {user.uid !== channel.createdBy ?
            <MaterialCommunityIcons style={styles.extraIcon} name="logout" size={32} color={colors.primary} onPress={()=>{
              Alert.alert('Leaving a channel', `Are you sure you want to leave "${channel.title}" channel`, [
                {
                  text: 'Cancel',
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel',
                },
                { text: 'Leave', onPress: async () => {
                  await firestore.collection('channels').doc(channel.id).update({
                    members: members.filter(member => member.id !== user.uid)})
                    handleAddMessage(`${user.displayName} has left the chat`,`Expo: ${user.displayName} has left the chat`,"expo","Expo")
                    navigation.navigate(routes.CHANNELS)
                } },
              ]);
            }}
          />
          : 
          null
        }
      </View>
      }
    </>
  )
}

const styles = StyleSheet.create({

  members: {
    flexDirection:"row",
    alignItems: "center",
    width:"100%",
    flex:1.1,
    backgroundColor: colors.white,
    paddingHorizontal:10,
    paddingTop:4,
    marginTop:Platform.OS === "android" ? StatusBar.currentHeight : 0,
    backgroundColor: colors.xlight
  },
  list:{
    width: "100%"
  },
  msgList:{
    flex: 1,
  },
  main:{
    flex:7,
    backgroundColor: colors.white,

  },
  control:{
    flexDirection:"row",
    backgroundColor:colors.white,
    flex:1.2,
    justifyContent:"space-between",
    alignItems:"center",
    paddingHorizontal:5,
    backgroundColor: colors.xlight
  },
  send:{
    flexDirection:"row",
    justifyContent:"space-around",
    alignItems:"center",
    width:"90%",
    borderWidth:2,
    borderColor:colors.primary,
    borderRadius:10,
    height:50,
    paddingVertical:10,
    color: colors.primary,
  },
  search:{
    width: "70%",
    color:colors.primary
  },
  extra:{
    flexDirection:"column",
    justifyContent:"space-between",
    alignItems:"center",
    width: 50,
    backgroundColor:colors.white,
    position: 'absolute',
    right: 0,
    bottom: "12%",
    paddingVertical:5,
  },
  extraIcon:{
    paddingVertical:5
  },
  bottomNavigationView: {
    backgroundColor: '#fff',
    width: '100%',
    height: "30%",
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius:10,
    borderTopRightRadius:10
  },
  createBtn: {
    width: "90%",
    height: 50,
    borderRadius:10,
    justifyContent:"center",
    alignItems:"center",
    marginTop:10

  },
  createTex:{
    color:colors.white,
    fontSize:18,
  },
  createLabel:{
    paddingHorizontal:25,
    paddingTop:10,
    alignSelf:"flex-start",
    fontSize:16,
  },
})
