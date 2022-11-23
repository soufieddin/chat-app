import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

import envs from '../config/env'
const app  = firebase.initializeApp({
  apiKey: envs.API_KEY,
  authDomain: envs.AUTH_DOMAIN,
  projectId: envs.PROJECT_ID,
  storageBucket: envs.STORAGE_BUCKET,
  messagingSenderId: envs.MESSAGING_SENDER_ID,
  appId: envs.APP_ID
});

export const auth = app.auth();
export const firestore = app.firestore();
export const storage = app.storage();

export default app;
