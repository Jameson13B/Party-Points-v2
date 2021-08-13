import firebase from 'firebase'

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
}

// Initialize Firebase
const Firebase = firebase.initializeApp(firebaseConfig)

// Database instance
export const db = Firebase.firestore()
export const serverTimestamp = () => firebase.firestore.FieldValue.serverTimestamp()

// Authorization instance
export const auth = Firebase.auth()

// Functions instance
export const functions = Firebase.functions()

// Cloud Functions
export const registerUser = functions.httpsCallable('registerUser')
export const updateUser = functions.httpsCallable('updateUser')
export const changePassword = functions.httpsCallable('changePassword')
