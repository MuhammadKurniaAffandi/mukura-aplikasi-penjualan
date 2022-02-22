import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import FirebaseProvider from './components/FirebaseProvider';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/login';
import LupaPassword from './pages/lupa-password';
import NotFound from './pages/not-found';
import Private from './pages/private';
import Registrasi from './pages/registrasi/index';
function App() {
  return (
    <FirebaseProvider>
      <Router>
        <Switch>
          <PrivateRoute path='/' component={Private} exact />
          <PrivateRoute path='/pengaturan' component={Private} />
          <PrivateRoute path='/produk' component={Private} />
          <PrivateRoute path='/transaksi' component={Private} />
          <Route path='/registrasi' component={Registrasi} />
          <Route path='/login' component={Login} />
          <Route path='/lupa-password' component={LupaPassword} />
          <Route component={NotFound} />
        </Switch>
      </Router>
    </FirebaseProvider>
  );
}

export default App;
