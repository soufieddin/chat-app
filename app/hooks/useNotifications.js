import {useEffect} from 'react';
import * as Notifications from 'expo-notifications';
import expoPushTokensApi from '../api/expoPushToken';



export default useNotifications = (notificationListner) => {
  useEffect(()=>{
    registerForPushNotifications();
    if(notificationListner) Notifications.addNotificationResponseReceivedListener(notificationListner);
  },[])
  const registerForPushNotifications = async() => {
    try{
      const permission = await Notifications.getPermissionsAsync();
      if(!permission.granted) return;
      const {data} = await Notifications.getExpoPushTokenAsync();
      expoPushTokensApi.register(data);
    }catch(error){
      console.log(error);
    }
  }

}