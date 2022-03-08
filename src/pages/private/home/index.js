import React from 'react';
// material ui
import { Button } from '@material-ui/core';
// firebase hooks
import { useFirebase } from '../../../components/FirebaseProvider';

function Home() {
  const { auth } = useFirebase();
  return (
    <>
      <h1>Halaman Home Buat Transaksi</h1>
      <Button onClick={(e) => auth.signOut()}>Sign Out</Button>
    </>
  );
}

export default Home;
