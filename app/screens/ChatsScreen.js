import React, {useEffect, useState} from 'react';
import { Text, StyleSheet, FlatList, View, TextInput, Switch } from 'react-native';
import {useAuth} from '../firebase/auth';
import colors from '../config/colors'
import Screen from '../components/Screen';
import Item from '../components/Item';
import ListLine from '../components/ListLine';
import routes from "../navigation/routes"
import useQuery from "../hooks/useQuery"
import { useFirestoreQuery } from '../firebase/useFirestoreQuery';
import {firestore} from '../firebase/firebase'

import _ from "lodash";

function ChatsScreen({ navigation}) {
  const{user} = useAuth();
  const [data1, setData1] = useState([]);
  //const [error, setError] = useState(null);
  const[query, setQuery] = useState("");
  const [isEnabled, setIsEnabled] = useState(false);
  const [contact, setContact] = useState([]);

  const { data } = useFirestoreQuery(firestore.collection('users'));
  const contacts = contact?.filter(c => c.uid !== user.uid)
  const setContactAsync = () => {
    orderByAfterChange(data?.map(i => ( { ...i } )));
    setData1(data?.map(i => ( { ...i } )));
  }
  useEffect(()=>{
    setContactAsync();
  }, [data])
 
  const orderByAfterChange = (data) => {
    data && data.sort((a,b) => b.status > a.status ? 1 : -1);
    setContact(data);
  }

  const toggleSwitch = () => {
    setIsEnabled(!isEnabled);
    
    const onlineUsers = data1.filter(ch => ch.status === "Online");
    {isEnabled === true ? setContact(data?.map(i => ( { ...i } ))) : setContact(onlineUsers )}
  };

  const handleSearch = (text) => {
    const formatQuery = text.toLowerCase();
    const filteredData = _.filter(data1, chat => {
      return useQuery(chat, formatQuery)
    })
    setQuery(formatQuery);
    orderByAfterChange(filteredData.filter(ch => !isEnabled || ch.status === "Online"));
  }
  return (
    <Screen style={styles.container}>
      <TextInput
        placeholder="Search by Email or Username"
        placeholderTextColor={colors.silver}
        style={styles.search}
        onChangeText={handleSearch}
      />
      <View style={styles.switch}>
        <Switch
          trackColor={{ false: colors.xlight , true: colors.white }}
          thumbColor={isEnabled ? colors.red : colors.silver}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isEnabled} 
        />
        <Text style={styles.switchText}>Show Only Online Users</Text>
      </View>
      <FlatList
        style={styles.list}
        data={contacts}
        keyExtractor={chat => chat.id}
        renderItem={({item})=>
        <Item
          title={item.displayName}
          image={item.avatar} 
          messages={item.msgs}
          status={item.status}
          

          onPress={ async()=> {
            const chatId = [user.uid, item.id].sort().join("_");
            await firestore.collection('chats').doc(chatId).set({
              lastMessage:"Last message",
              messages:[]
            })
            navigation.navigate(routes.PRIVATE_CHAT_SCREEN, item)
          }}
        />
      }
      ItemSeparatorComponent={()=><ListLine/>}
      />

    
    </Screen>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal:10,
    paddingBottom: 130
  },
  topic:{
    backgroundColor: colors.primary,
    height:60,
    justifyContent:"center",
    paddingHorizontal:10,
    // borderBottomLeftRadius:20,
    // borderBottomRightRadius:20
  },
  title:{
    color: colors.white,
    fontSize:24
  },
  list: {
    overflow: "scroll",
  },
  btn: {
    width: '70%',
    height: 60,
    backgroundColor:colors.primary,
    borderRadius:10,
    justifyContent:"center",
    alignItems:"center",
    padding: 15,
    marginVertical:10,
    alignSelf:"center",
    position: 'absolute',
    bottom: -300,
  },
  search:{
    borderWidth:2,
    borderColor:colors.primary,
    borderRadius:10,
    height: 50,
    paddingHorizontal:10,
    marginBottom:20
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
})

export default ChatsScreen;