import React, { useState } from 'react';

// import firebase
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';

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

// notistack hook
import { useSnackbar } from 'notistack';

function LupaPassword() {
  const classes = useStyles();

  // state untuk data form
  const [form, setFrom] = useState({
    email: '',
  });

  // state untuk data error form
  const [error, setError] = useState({
    email: '',
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
  // nutistack hook
  const { enqueueSnackbar } = useSnackbar();

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
        const actionCodeSettings = {
          url: `${window.location.origin}/login`,
        };
        await sendPasswordResetEmail(getAuth(), form.email, actionCodeSettings);
        enqueueSnackbar(
          `Cek kotak masuk email: ${form.email}, sebuah tautan untuk me-reset password sudah dikirim`,
          {
            variant: 'success',
          }
        );
        setIsSubmitting(false);
      } catch (e) {
        const newError = {};
        switch (e.code) {
          // untuk email sudah terdaftar
          case 'auth/user-not-found':
            newError.email = 'Email tidak ditemukan';
            break;

          // email sudah tidak valid
          case 'auth/invalid-email':
            newError.email = 'Email tidak valid';
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
          Lupa Password
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

          <Grid container className={classes.buttons}>
            <Grid item xs>
              <Button
                type='submit'
                color='primary'
                variant='contained'
                size='large'
                disabled={isSubmitting}
              >
                Kirim
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

export default LupaPassword;
