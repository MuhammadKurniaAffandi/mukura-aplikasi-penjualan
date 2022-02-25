import React from 'react';

import { Button } from '@material-ui/core';
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
