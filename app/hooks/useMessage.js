import {firestore } from '../firebase/firebase'
import firebase from 'firebase/compat/app';
import { useFirestoreQuery } from '../firebase/useFirestoreQuery';
import { useAuth } from '../firebase/auth';
import uuid from 'react-native-uuid';



export const useMessage = (ch, typ) => {
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
      lastMessage: `${lastMsg.slice(0, 22)}...`
    }) 
}

return {handleAddMessage}
}