import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import FirebaseProvider from './components/FirebaseProvider';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/login';
import LupaPassword from './pages/lupa-password';
import NotFound from './pages/not-found';
import Private from './pages/private';
import Registrasi from './pages/registrasi/index';

// imoort komponen material-ui
import { CssBaseline } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import theme from './config/theme';
import { SnackbarProvider } from 'notistack';

function App() {
  return (
    <>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <SnackbarProvider maxSnack={3} autoHideDuration={3000}>
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
        </SnackbarProvider>
      </ThemeProvider>
    </>
  );
}

export default App;
