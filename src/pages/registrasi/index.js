import React, { useState } from 'react';

// import firebase
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

// import komponent material-ui
import {
  Button,
  Container,
  Paper,
  Typography,
  TextField,
  Grid,
} from '@material-ui/core';

// import useStyles
import useStyles from './styles';

/* import react router */
import { Link, Redirect } from 'react-router-dom';

// import untuk validator
import isEmail from 'validator/lib/isEmail';

// firebase hook
import { useFirebase } from '../../components/FirebaseProvider';

// component AppLoading
import AppLoading from '../../components/AppLoading';

function Registrasi() {
  const classes = useStyles();

  // state untuk data form
  const [form, setFrom] = useState({
    email: '',
    password: '',
    ulangi_password: '',
  });

  // state untuk data error form
  const [error, setError] = useState({
    email: '',
    password: '',
    ulangi_password: '',
  });

  // fungsi untuk onChange
  const handleChange = (e) => {
    setFrom({
      ...form,
      [e.target.name]: e.target.value,
    });

    setError({
      ...error,
      [e.target.name]: '',
    });
  };

  // state untuk loading
  const [isSubmitting, setIsSubmitting] = useState(false);

  // firebase hook
  const { user, loading } = useFirebase();

  // untuk untuk validasi
  const validate = () => {
    // buat variabel untuk menampung error
    const newError = { ...error };

    // validasi untuk email
    if (!form.email) {
      newError.email = 'Email wajib diisi';
    } else if (!isEmail(form.email)) {
      newError.email = 'Email tidak valid';
    }

    // Validasi untuk password
    if (!form.password) {
      newError.password = 'Password wajib diisi';
    }

    // validasi untuk ulangi password
    if (!form.ulangi_password) {
      newError.ulangi_password = 'Ulangi Password wajib diisi';
    } else if (form.ulangi_password !== form.password) {
      newError.ulangi_password = 'Ulangin Password tidak sama dengan Password';
    }

    return newError;
  };

  // fungsi untuk handle submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // mencari error jika ada
    const findErrors = validate();
    if (Object.values(findErrors).some((err) => err !== '')) {
      setError(findErrors);
    } else {
      try {
        setIsSubmitting(true);
        await createUserWithEmailAndPassword(
          getAuth(),
          form.email,
          form.password
        );
      } catch (e) {
        const newError = {};
        switch (e.code) {
          // untuk email sudah terdaftar
          case 'auth/email-already-in-use':
            newError.email = 'Email sudah terdaftar';
            break;

          // email sudah tidak valid
          case 'auth/invalid-email':
            newError.email = 'Email tidak valid';
            break;

          // untuk password lemah
          case 'auth/weak-password':
            newError.password = 'Password lemah';
            break;

          // untuk metode email dan password yang tidak didukung
          case 'auth/operation-not-allowed':
            newError.email = 'Metode Email dan Password tidak didukung';
            break;

          default:
            newError.email = 'Terjadi kesalahan, silahkan coba lagi';
            break;
        }
        setError(newError);
        setIsSubmitting(false);
      }
    }
  };

  if (loading) {
    return <AppLoading />;
  }
  if (user) {
    return <Redirect to='/' />;
  }

  return (
    <Container maxWidth='xs'>
      <Paper className={classes.paper}>
        <Typography className={classes.title} variant='h5' component='h1'>
          Buat Akun Baru
        </Typography>

        {/* Awal Component input textfield */}
        <form onSubmit={handleSubmit} noValidate>
          <TextField
            id='email'
            type='email'
            name='email'
            margin='normal'
            label='Alamat Email'
            fullWidth
            required
            value={form.email}
            onChange={handleChange}
            helperText={error.email}
            error={error.email ? true : false}
            disabled={isSubmitting}
          />
          <TextField
            id='password'
            type='password'
            name='password'
            margin='normal'
            label='Password'
            fullWidth
            required
            value={form.password}
            onChange={handleChange}
            helperText={error.password}
            error={error.password ? true : false}
            disabled={isSubmitting}
          />
          <TextField
            id='ulangi_password'
            type='password'
            name='ulangi_password'
            margin='normal'
            label='Ulangi Password'
            fullWidth
            required
            value={form.ulangi_password}
            onChange={handleChange}
            helperText={error.ulangi_password}
            error={error.ulangi_password ? true : false}
            disabled={isSubmitting}
          />

          <Grid container className={classes.buttons}>
            <Grid item xs>
              <Button
                type='submit'
                color='primary'
                variant='contained'
                size='large'
                disabled={isSubmitting}
              >
                Daftar
              </Button>
            </Grid>

            <Grid item>
              <Button
                component={Link}
                to='/login'
                variant='contained'
                size='large'
                disabled={isSubmitting}
              >
                Login
              </Button>
            </Grid>
          </Grid>
        </form>
        {/* Akhir Component input textfield */}
      </Paper>
    </Container>
  );
}

export default Registrasi;
