import React from 'react';

import { Switch, Route, Redirect } from 'react-router-dom';
import Pengguna from './Pengguna';
import Toko from './Toko';
function Pengaturan() {
  return (
    <Switch>
      <Route path='/pengaturan/pengguna' component={Pengguna} />
      <Route path='/pengaturan/toko' component={Toko} />
      <Redirect to='/pengaturan/pengguna' />
    </Switch>
  );
}

export default Pengaturan;
