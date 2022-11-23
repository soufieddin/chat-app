import React, {useState, useEffect} from 'react';
import { StyleSheet, FlatList, View, TextInput, Switch, Text, Alert, Image, TouchableWithoutFeedback } from 'react-native';
import firebase from 'firebase/compat/app';
import {useAuth} from '../firebase/auth';
import colors from '../config/colors'
import Screen from '../components/Screen';
import ItemChannels from '../components/ItemChannels';
import ListLine from '../components/ListLine';
import ListItemDeleteAction from '../components/ListItemDeleteAction';
import routes from "../navigation/routes"
import _ from "lodash";
import Button from '../components/Button';
import ListItemEditAction from '../components/ListItemEditAction';
import { BottomSheet } from 'react-native-btr';
import {firestore, storage } from '../firebase/firebase'
import { useFirestoreQuery } from '../firebase/useFirestoreQuery';
import useSearch from '../hooks/useSearch';
import { useFirestoreCrud } from '../firebase/useFirestoreCrud';
import * as ImagePicker from 'expo-image-picker'; 
import {MaterialCommunityIcons} from '@expo/vector-icons'
import ActivityIndicator from '../components/ActivityIndicator';
import uuid from 'react-native-uuid';
import * as Battery from 'expo-battery';

function ChannelsScreen({ navigation }) {
  
  const {user} = useAuth();
  const [visible, setVisible] = useState(false);
  const [visible1, setVisible1] = useState(false);
  const [chId, setChId] = useState("");
  const { deleteDoc } = useFirestoreCrud(firestore.collection('channels'));
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAddMessage = async(idCH) => {
    const avatarUrl = await storage.ref('default_avatar.png').getDownloadURL();
    firestore.collection('channels').doc(idCH).collection('messages').add({
      id:uuid.v4(),
      message: `${user.displayName} has joined the chat`,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      sender_id : "expo",
      sender_username: "Expo",
      sender_image: avatarUrl,
      type:"expo"
    })
    firestore.collection('channels').doc(idCH).update({
      lastMessage: `Expo: ${user.displayName} has joined the chat`.slice(0,22)
    }) 
}

  const toggleBottomNavigationView = () => {
    //Toggling the visibility state of the bottom sheet
    setVisible(!visible);
  };
  const toggleBottomNavigationView1 = () => {
    //Toggling the visibility state of the bottom sheet
    setVisible1(!visible1);
  };

  const [titles, setTitles] = useState([]);
  const[query, setQuery] = useState("");
  const [channelTitle, setChannelTitle] = useState("");
  const [newChannelTitle, setNewChannelTitle] = useState("");
  const [fullData, setFullData] = useState([]);
  const [rooms, setRooms] = useState([]);
  const { data } = useFirestoreQuery(firestore.collection('channels'));
  const { data: currentUser } = useFirestoreQuery(firestore.collection('users').doc(user.uid));
  const [isEnabled, setIsEnabled] = useState(false);
  const [batteryLevel, setBatteryLevel] = useState(null)
    
  // const setChannelsAsync = async (level) => {
  //   level = level || batteryLevel;
  //   if(level < 10.0){
  //     setRooms(data?.map(i => ( { ...i } )));
  //     setFullData(data?.map(i => ( { ...i } )));
  //   }
  //   else{
  //     setRooms(data?.map(i => ( { ...i } )).filter(i => i.title !== "#dying-together"));
  //     setFullData(data?.map(i => ( { ...i } )).filter(i => i.title !== "#dying-together"));
  //   }
  //   setTitles(data?.map(i=> i.title))
  // }

  // useEffect(() => {
  //   Battery.getBatteryLevelAsync().then((level) => {
  //     const levelToSet = (level * 100).toFixed(1);
  //     console.log(`Battery level set up to ${levelToSet}`);
  //     setBatteryLevel(levelToSet)
  //   });
  //   const intervalToCheck = setInterval(async () => {
  //     const batteryLevel = await Battery.getBatteryLevelAsync();
  //     const batteryLevelToSet = (batteryLevel * 100).toFixed(1);
  //     //console.log(`Battery level is ${batteryLevel}`);
  //     if(batteryLevelToSet !== batteryLevel) {
  //       setBatteryLevel(batteryLevelToSet);
  //       setChannelsAsync(batteryLevelToSet);
  //     }
  //   }, 10000);

  //   return () => {
  //     console.log(`Unmounted from channels`);
  //     clearInterval(intervalToCheck);
  //   };
  // }, [])


  const setChannelsAsync = async() => {
    const level = await Battery.getBatteryLevelAsync();
    setBatteryLevel((level * 100).toFixed(1))
    if(batteryLevel < 10.0){
      setRooms(data?.map(i => ( { ...i } )));
      setFullData(data?.map(i => ( { ...i } )));
    }
    else{
      setRooms(data?.map(i => ( { ...i } )).filter(i => i.title !== "#dying-together"));
      setFullData(data?.map(i => ( { ...i } )).filter(i => i.title !== "#dying-together"));
    }
    setTitles(data?.map(i=> i.title))
  }
  useEffect(()=>{
    setChannelsAsync();
  }, [data, batteryLevel])


  const toggleSwitch = () => {
    setIsEnabled(previousState => !previousState);
    const favData = fullData.filter(ch => currentUser?.favoriteChannels?.includes(ch.id));
    {isEnabled === true ? setRooms(fullData) : setRooms(favData )}
  };

  //search channel handler
  const handleSearch = (text) => {
    const formatQuery = text.toLowerCase();
    const filteredData = _.filter(fullData, ch => {
      return useSearch(ch, formatQuery)
    })
    setQuery(formatQuery);
    setRooms(filteredData.filter(ch => !isEnabled ||  ch.favo === true));
  } 

  const uploadImage = async (uri, imageName) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    let ref = firebase.storage().ref().child(`images/${imageName}/avatar`);
    return ref.put(blob);
  }
  //create channel handler
  const handleCreateChannel = async () => {
    const avatarUrl = await storage.ref('default_avatar.png').getDownloadURL();
    if(channelTitle.length > 0){
      if(!titles.includes(channelTitle)){
        await firestore.collection('channels').add({
          title: channelTitle,
          createdBy: user.uid,
          avatar: avatarUrl,
          members:[
            {
              id:user.uid,
            }
          ],
          lastMessage:"Last message",
        })
        setLoading(false)
        setVisible(false)
      } else{
        Alert.alert("This title already exists, or its empty!")
      }
    }
  }

  const handlePress = (pic, setPic) => {
    if(!pic) pickImage(setPic);
    else Alert.alert('Delete', 'Are you sure you want to delete this image?', [
      {text: "Yes", onPress: () => setPic(null)},
      {text: "No"}
    ])
  }
  const pickImage = async (setPic) => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.5,
    });

    console.log(result.uri);

    if (!result.cancelled) {
      setPic(result.uri);
    }
  };


  const handleDelete = channel => deleteDoc(channel.id);
  return (
    <>
    <ActivityIndicator visible={loading} />
    <Screen style={styles.container}>

      {/* Create Channel sheet */}
        <BottomSheet
          visible={visible}
          onBackButtonPress={toggleBottomNavigationView}
          onBackdropPress={toggleBottomNavigationView}
        >
           <View style={styles.bottomNavigationView}>

            <Text style={styles.createLabel}>Channel's Title</Text>
            <TextInput
              placeholder="NewChannel"
              placeholderTextColor={colors.silver}
              style={styles.createChannel}
              onChangeText={(text)=>setChannelTitle(`#${text}`)}
            />
            <Button styleBtn={styles.createBtn} text="Create" color="primary" styleText={styles.createTex} onPress={()=>{
              setLoading(true)
              handleCreateChannel()
            }}/>
           </View>
        </BottomSheet>

        {/* Edit Channel sheet */}
        <BottomSheet
          visible={visible1}
          onBackButtonPress={toggleBottomNavigationView1}
          onBackdropPress={toggleBottomNavigationView1}
        >
           <View style={styles.bottomNavigationView}>
           <TouchableWithoutFeedback onPress={()=>handlePress(image, setImage)}>
                <View style={styles. imagePic}>
                  { !image && ( <MaterialCommunityIcons color={colors.white} name="camera" size={50} /> ) }
                  { image && ( <Image source={{ uri:image }} style={{ width: 100, height: 100, borderRadius:14 }}/> ) }
                </View>
              </TouchableWithoutFeedback>
            <Text style={styles.createLabel}>New Channel's Title</Text>
            <TextInput
              placeholder="New Channel's Name"
              placeholderTextColor={colors.silver}
              style={styles.createChannel}
              onChangeText={(text)=>setNewChannelTitle(`#${text}`)}
            />
            <Button styleBtn={styles.createBtn} text="Update" color="primary" styleText={styles.createTex} onPress={async()=> {
              setLoading(true)
              if(newChannelTitle.length > 0 && image){
                if(!titles.includes(newChannelTitle)){
                  
                  await uploadImage(image, chId)
                  const avatar = await storage.ref(`images/${chId}/avatar`).getDownloadURL();
                  await firestore.collection('channels').doc(chId).update({
                    title:newChannelTitle,
                    avatar:avatar
                  })
                  setVisible1(false)
                  setLoading(false)
                  setImage(null)
                }
                else{
                  Alert.alert("This title already exists, or its empty!")
                }
              }
              else if(newChannelTitle.length > 0 && !image){
                if(!titles.includes(newChannelTitle)){
                  await firestore.collection('channels').doc(chId).update({
                    title:newChannelTitle,
                  })
                  setVisible1(false)
                  setLoading(false)
                }else{
                  Alert.alert("This title already exists, or its empty!")
                }
              }
              else if(newChannelTitle === "" && image){
                await uploadImage(image, chId);
                const avatar = await storage.ref(`images/${chId}/avatar`).getDownloadURL();
                await firestore.collection('channels').doc(chId).update({
                  avatar: avatar,
                })
                setVisible1(false)
                setLoading(false)
                setImage(null)
              }
                
              }
            } />
           </View>
        </BottomSheet>

        <View style={styles.topic}>
          <TextInput
            placeholder="Search a channel"
            placeholderTextColor={colors.silver}
            style={styles.search}
            onChangeText={handleSearch}
          />
          <Button styleBtn={styles.btn} text="+" color="primary" styleText={styles.tex} onPress={toggleBottomNavigationView}/>
        </View>
        <View style={styles.switch}>
          <Switch
            trackColor={{ false: colors.xlight , true: colors.white }}
            thumbColor={isEnabled ? colors.red : colors.silver}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
          <Text style={styles.switchText}>Show Only Favorite Channels</Text>
        </View>
        <FlatList
          style={styles.list}
          data={rooms}
          keyExtractor={channel => channel.id.toString()}
          renderItem={({item})=>
          <ItemChannels 
            title={item.title} 
            subtitle={item.lastMessage} 
            image={item.avatar} 
            messages={item.messages && item.messages.length > 0 ? item.messages : null}
            creator={item.createdBy}
            favo={currentUser?.favoriteChannels?.includes(item.id) ? true : false}
            handlePress={()=> {
              let arrayAction;
              if(!currentUser?.favoriteChannels?.includes(item.id)){
                arrayAction = firebase.firestore.FieldValue.arrayUnion;
              }
              else{
                arrayAction = firebase.firestore.FieldValue.arrayRemove;
              }
              const doc =firestore.doc(`users/${user.uid}`);
              doc.update({
                favoriteChannels:arrayAction(
                  item.id
                )
              })
            }}
            onPress={()=> {
              const chMembers = item.members.map(i => i.id);
              if(chMembers.includes(user.uid)){
                navigation.navigate(routes.GROUPE_CHAT_SCREEN, item);
              }else{
                Alert.alert('Joining A Channel', `Are you sure you want to join "${item.title}" channel`, [
                  {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                  },
                  { text: 'Confirm', onPress: () => {
                    handleAddMessage(item.id)
                    const arrayUnion = firebase.firestore.FieldValue.arrayUnion;
                    const doc =firestore.doc(`channels/${item.id}`);
                    doc.update({
                      members:arrayUnion({
                        id:user.uid,
                      })
                    })
                    navigation.navigate(routes.GROUPE_CHAT_SCREEN, item);
                  } },
                ]);
              }
            }}
            members={item.members}
            renderRightActions={()=> item.createdBy === user.uid ? ( 
              <View style={styles.actions}>
                <ListItemEditAction onPress={()=>{
                  setVisible1(true);
                  setChId(item.id)
                }} />
                <ListItemDeleteAction onPress={()=>{
                  Alert.alert('Delete Channel', `Are you sure you want to Delete ${item.title} `, [
                    {
                      text: 'Cancel',
                      onPress: () => console.log('Cancel Pressed'),
                      style: 'cancel',
                    },
                    { text: 'Delete', onPress: () => {
                      handleDelete(item)
                    } },
                  ]);
                }} />
              </View>
              ) : null}

          />
        }
        ItemSeparatorComponent={()=><ListLine/>}
        
        />

    </Screen>
    </>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal:10,
    paddingBottom:130
  },
  topic:{
    flexDirection:"row",
    height:60,
    justifyContent:"space-between",
  },
  title:{
    color: colors.white,
    fontSize:24
  },
  list: {
    overflow: "scroll",
  },
  btn: {
    width: 50,
    height: 50,
    backgroundColor:colors.primary,
    borderRadius:10,
    justifyContent:"center",
    alignItems:"center",

  },
  createBtn: {
    width: "90%",
    height: 50,
    backgroundColor:colors.primary,
    borderRadius:10,
    justifyContent:"center",
    alignItems:"center",

  },
  createLabel:{
    paddingHorizontal:25,
    paddingVertical:10,
    alignSelf:"flex-start",
    fontSize:16,
  },
  switch: {
    flexDirection:"row",
    paddingHorizontal:10,
    width: "100%",
    height: 50,
    backgroundColor:colors.primary,
    borderRadius:10,
    justifyContent:"space-between",
    alignItems:"center",
    marginBottom:20
  },
  switchText:{
    color:colors.white,
  },
  tex:{
    color:colors.white,
    fontSize:32,
  },  
  createTex:{
    color:colors.white,
    fontSize:24,
  },   
  search:{
    borderWidth:2,
    borderColor:colors.primary,
    borderRadius:10,
    height: 50,
    paddingHorizontal:10,
    marginBottom:20,
    width: "80%",
  },
  createChannel:{
    borderWidth:2,
    borderColor:colors.primary,
    borderRadius:10,
    height: 50,
    paddingHorizontal:10,
    marginBottom:20,
    width: "90%",
  },
  actions:{
    flexDirection:"row",
    justifyContent:"space-between",
    width: 100
  },
  bottomNavigationView: {
    backgroundColor: '#fff',
    width: '100%',
    height: "45%",
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius:10,
    borderTopRightRadius:10
  },
  imagePic:{
    width:100,
    height: 100,
    borderRadius: 14,
    backgroundColor:colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:20
  }
})

export default ChannelsScreen;