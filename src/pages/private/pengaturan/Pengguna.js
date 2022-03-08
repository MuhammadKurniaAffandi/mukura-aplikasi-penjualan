import React, { useRef, useState } from 'react';
// styles
import useStyles from './styles/pengguna';
// material-ui
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
// firebase hook
import { useFirebase } from '../../../components/FirebaseProvider';
import {
  updateEmail,
  updateProfile,
  sendEmailVerification,
  updatePassword,
} from 'firebase/auth';
import { useSnackbar } from 'notistack';
// validator email
import isEmail from 'validator/lib/isEmail';
function Pengguna() {
  const classes = useStyles();
  const { user } = useFirebase();
  const [error, setError] = useState({
    displayName: '',
    email: '',
    password: '',
  });

  const { enqueueSnackbar } = useSnackbar();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const displayNameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const saveDisplayName = async (e) => {
    const displayName = displayNameRef.current.value;
    if (!displayName) {
      setError({
        displayName: 'Nama wajib diisi',
      });
    } else if (displayName !== user.displayName) {
      setError({
        displayName: '',
      });
      setIsSubmitting(true);
      await updateProfile(user, { displayName });
      setIsSubmitting(false);
      enqueueSnackbar('Data pengguna berhasil diperbarui', {
        variant: 'success',
      });
    }
  };

  const updateEmaill = async (e) => {
    const email = emailRef.current.value;
    // validasi email
    if (!email) {
      setError({
        email: 'Email wajib diisi',
      });
    } else if (!isEmail(email)) {
      setError({
        email: 'Email tidak valid',
      });
    } else if (email !== user.email) {
      setError({
        email: '',
      });
      setIsSubmitting(true);
      try {
        await updateEmail(user, email);
        enqueueSnackbar('Email berhasil diperbarui', { variant: 'success' });
      } catch (error) {
        let emailError = '';
        switch (error.code) {
          // validasi jika email sudah digunakan
          case 'auth/email-already-in-use':
            emailError = 'Email sudah digunakan oleh pengguna lain';
            break;
          // validasi jika email tidak valid
          case 'auth/invalid-email':
            emailError = 'Email tidak valid';
            break;
          // memberi arahkan kepada pengguna untuk login kembali
          case 'auth/requires-recent-login':
            emailError =
              'Silahkan logout kemudian login kembali untuk memperbarui email';
            break;
          // validasi jika semua data email salah
          default:
            emailError = 'Terjadi kesalahan, silahkan coba lagi';
            break;
        }
        setError({
          email: emailError,
        });
      }
      setIsSubmitting(false);
    }
  };

  const handleSendEmailVerification = async (e) => {
    const actionCodeSettings = {
      url: `${window.location.origin}/login`,
    };
    setIsSubmitting(true);
    await sendEmailVerification(user, actionCodeSettings);
    enqueueSnackbar(
      `Email verifikasi telah dikirim ${emailRef.current.value}`,
      { variant: 'success' }
    );
    setIsSubmitting(false);
  };

  const handleUpdatePassword = async (e) => {
    const password = passwordRef.current.value;
    if (!password) {
      setError({
        password: 'Password wajib diisi',
      });
    } else {
      setError({
        password: '',
      });
      setIsSubmitting(true);
      try {
        await updatePassword(user, password);
        enqueueSnackbar('Password berhasil diperbarui', { variant: 'success' });
      } catch (error) {
        let errorPassword = '';
        switch (error.code) {
          // validasi jika password lemah
          case 'auth/weak-password':
            errorPassword = 'Password terlalu lemah';
            break;
          // memberi arahkan kepada pengguna untuk login kembali
          case 'auth/requires-recent-login':
            errorPassword =
              'Silahkan logout kemudian login kembali untuk memperbarui Password';
            break;
          // validasi jika masukan password semua salah
          default:
            errorPassword = 'Terjadi kesalahan, silahkan coba lagi';
            break;
        }
        setError({
          password: errorPassword,
        });
      }
      setIsSubmitting(false);
    }
  };
  return (
    <div className={classes.pengaturanPengguna}>
      <TextField
        id='displayName'
        name='displayName'
        label='Nama'
        defaultValue={user.displayName}
        margin='normal'
        inputProps={{
          ref: displayNameRef,
          onBlur: saveDisplayName,
        }}
        disabled={isSubmitting}
        helperText={error.displayName}
        error={error.displayName ? true : false}
      />
      <TextField
        id='email'
        name='email'
        label='Email'
        type='email'
        defaultValue={user.email}
        margin='normal'
        inputProps={{
          ref: emailRef,
          onBlur: updateEmaill,
        }}
        disabled={isSubmitting}
        helperText={error.email}
        error={error.email ? true : false}
      />
      {user.emailVerified ? (
        <Typography color='primary' variant='subtitle1'>
          Email sudah terverifikasi
        </Typography>
      ) : (
        <Button
          variant='outlined'
          onClick={handleSendEmailVerification}
          disabled={isSubmitting}
        >
          Kirim email verifikasi
        </Button>
      )}
      <TextField
        id='password'
        name='password'
        label='Password Baru'
        type='password'
        defaultValue={user.password}
        margin='normal'
        inputProps={{
          ref: passwordRef,
          onBlur: handleUpdatePassword,
        }}
        autoComplete='new-password'
        disabled={isSubmitting}
        helperText={error.password}
        error={error.password ? true : false}
      />
    </div>
  );
}

export default Pengguna;
