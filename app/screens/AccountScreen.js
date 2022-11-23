import React from 'react'
import { FlatList, StyleSheet, Text, View } from 'react-native'
import {useAuth} from '../firebase/auth';
import colors from '../config/colors'
import Button from '../components/Button';
import Screen from '../components/Screen';
import routes from '../navigation/routes';
import ListItem from '../components/ListItem';
import Icon from '../components/Icon';
import ListLine from '../components/ListLine';

const items = [
  {
    id:1,
    title: 'Profile',
    icon:{
      name:'account',
      backgroundColor: colors.primary,
    },
    targetScreen: routes.EDIT_PROFILE_SCREEN
  },
  {
    id:2,
    title: 'Notifications',
    icon:{
      name:'bell-ring',
      backgroundColor: colors.medium,
    },
    targetScreen: routes.CONTROL_NOTIFICATIONS_SCREEN
  }
];


export default function AccountScreen({navigation}) {
  const{logout} = useAuth();
  return (
    <Screen style={styles.container}>
      <View style={styles.wrapper}>
        <FlatList
            data={items}
            keyExtractor={item=> item.id}
            ItemSeparatorComponent={()=><ListLine />}
            renderItem = {({item})=> 
              <ListItem
                title={item.title}
                IconComponent={
                <Icon
                  name={item.icon.name}
                  backgroundColor={item.icon.backgroundColor}
                />
              }
              onPress={() => navigation.navigate(item.targetScreen)}
            />
            }
        />
        <View style={styles.out}>
          <ListItem
            style={styles.leave}
            title="Log Out"
            IconComponent={
              <Icon
                name="logout"
                backgroundColor={colors.red}
              />
            }
            onPress={logout}
          />
        </View>

      </View>
    </Screen>
  )
}

const styles = StyleSheet.create({
  container: {
    marginVertical:20,

  },
  out:{
    marginTop:50
  }
})
