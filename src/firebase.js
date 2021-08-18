import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  // databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  // messagingSenderId: process.env.REACT_APP_MESSAING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
}

// Initialize Firebase
const Firebase = firebase.initializeApp(firebaseConfig)

// Database instance
export const db = Firebase.firestore()
export const serverTimestamp = () => firebase.firestore.FieldValue.serverTimestamp()

// Authorization instance
export const loginUtil = (user) => {
  const payload = JSON.stringify(user)

  user.track === 'Teacher'
    ? sessionStorage.setItem('ppuser', payload)
    : localStorage.setItem('ppuser', payload)
}

export const logoutUtil = (user) => {
  const teacher = sessionStorage.getItem('ppuser')

  if (teacher) {
    sessionStorage.removeItem('ppuser')
  } else {
    localStorage.removeItem('ppuser')
  }
}

export const statusUtil = () => {
  const teacher = sessionStorage.getItem('ppuser')
  const student = localStorage.getItem('ppuser')

  if (teacher) {
    return JSON.parse(teacher)
  } else if (student) {
    return JSON.parse(student)
  } else {
    return null
  }
}
