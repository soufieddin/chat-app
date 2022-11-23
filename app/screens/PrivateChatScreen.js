import React, {useState} from 'react'
import {StyleSheet, Text, View, Platform, StatusBar, TextInput, FlatList, Alert } from 'react-native'
import Item from '../components/Item';
import ListLine from '../components/ListLine';
import colors from '../config/colors'
import {MaterialCommunityIcons} from '@expo/vector-icons'
import Message from '../components/Message';
import {useAuth} from '../firebase/auth';
import { useFirestoreQuery } from '../firebase/useFirestoreQuery';
import { firestore } from '../firebase/firebase';
import useLocation from '../hooks/useLocation'
import { useGallery } from '../hooks/useGallery';
import { useAudio } from '../hooks/useAudio';
import { BottomSheet } from 'react-native-btr';
import Button from '../components/Button';
import {useMessage} from '../hooks/useMessage'

export default function PrivateChatScreen({ route }) {
  const [extraMenu, setExtraMenu] = useState(false);
  const location = useLocation();
  const chat = route.params;
  const {user} = useAuth();
  const chatId = [user.uid, chat.id].sort().join("_");
  const [textMsg, setTextMsg] = useState("");
  const { data: messages } = useFirestoreQuery(firestore.collection('chats').doc(chatId).collection("messages").orderBy('timestamp', 'desc'));
  const [visible, setVisible] = useState(false);
  const {handlePress, handlePressCam} = useGallery(chatId, "chats");
  const {handleAddMessage} = useMessage(chatId, "chats");
  const {stopRecording, startRecording, playSound, recording, record} = useAudio();

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
      <View style={styles.item}>
        <Item 
          title={chat.displayName}
          image={chat.avatar}
          status={chat.status}
        />
        <ListLine/>
      </View>
      <View style={styles.main}>
      <FlatList
        inverted
        data={messages}
        style={styles.msgList}
        keyExtractor={message => message.id}
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
      </View>
      }

    </>
  )
}

const styles = StyleSheet.create({

  item:{
    flex: 1.11,
    marginTop:Platform.OS === "android" ? StatusBar.currentHeight : 0,
    paddingHorizontal:10,
  },
  main:{
    flex:7,
    padding:10,
    
  },
  control:{
    flexDirection:"row",
    backgroundColor: colors.xlight,
    flex:1.2,
    justifyContent:"space-between",
    alignItems:"center",
    paddingHorizontal:5,
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
  },
  search:{
    width: "70%",
    color:colors.primary
  },
  extra:{
    flexDirection:"column",
    justifyContent:"space-between",
    alignItems:"center",
    height:150,
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

