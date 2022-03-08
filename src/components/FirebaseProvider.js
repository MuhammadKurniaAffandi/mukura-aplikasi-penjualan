import React, { createContext, useContext } from 'react';

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import firebaseConfig from '../config/firebase';

import { useAuthState } from 'react-firebase-hooks/auth';

const FirebaseContext = createContext();

const app = initializeApp(firebaseConfig);

export function useFirebase() {
  return useContext(FirebaseContext);
}

function FirebaseProvider(props) {
  const auth = getAuth(app);
  const firestore = getFirestore(app);
  const storage = getStorage();

  const [user, loading, error] = useAuthState(auth);

  return (
    <FirebaseContext.Provider
      value={{
        auth,
        firestore,
        storage,
        user,
        loading,
        error,
      }}
    >
      {props.children}
    </FirebaseContext.Provider>
  );
}

export default FirebaseProvider;
