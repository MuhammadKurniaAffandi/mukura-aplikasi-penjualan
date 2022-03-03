import React, { useEffect, useState } from 'react';
// material-ui
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
// styles
import useStyles from './styles/toko';
// firebase
import { doc, setDoc } from 'firebase/firestore';
// validator
import isURL from 'validator/lib/isURL';
// firebase hook
import { useFirebase } from '../../../components/FirebaseProvider';
import { useDocument } from 'react-firebase-hooks/firestore';
// Snackbar
import { useSnackbar } from 'notistack';
// komponent
import AppPageLoading from '../../../components/AppPageLoading';
// react router
import { Prompt } from 'react-router-dom';

function Toko() {
  const classes = useStyles();
  const { firestore, user } = useFirebase();

  const tokoDoc = doc(firestore, `toko/${user.uid}`);
  const [snapshot, loading] = useDocument(tokoDoc);
  const { enqueueSnackbar } = useSnackbar();
  const [form, setForm] = useState({
    nama: '',
    alamat: '',
    telepon: '',
    website: '',
  });

  const [error, setError] = useState({
    nama: '',
    alamat: '',
    telepon: '',
    website: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSomethingChange, setIsSomethingChange] = useState(false);

  useEffect(() => {
    if (snapshot) {
      setForm(snapshot.data());
    }
  }, [snapshot]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setError({
      [e.target.name]: '',
    });
    setIsSomethingChange(true);
  };

  const validate = () => {
    const newError = { ...error };

    // validasi untuk Nama
    if (!form.nama) {
      newError.nama = 'Nama wajib diisi';
    }
    // validasi untuk Alamat
    if (!form.alamat) {
      newError.alamat = 'Alamat wajib diisi';
    }
    // validasi untuk Telepon
    if (!form.telepon) {
      newError.telepon = 'Telepon wajib diisi';
    }
    // validasi untuk Website
    if (!form.website) {
      newError.website = 'Website wajib diisi';
    } else if (!isURL(form.website)) {
      newError.website = 'URL Website tidak valid';
    }

    return newError;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const findErrors = validate();
    if (Object.values(findErrors).some((err) => err !== '')) {
      setError(findErrors);
    } else {
      setIsSubmitting(true);
      try {
        await setDoc(tokoDoc, form, { merge: true });
        setIsSomethingChange(false);
        enqueueSnackbar(`Data Toko berhasil disimpan`, { variant: 'success' });
      } catch (error) {
        enqueueSnackbar(error.message, { variant: 'error' });
      }
      setIsSubmitting(false);
    }
  };
  if (loading) {
    return <AppPageLoading />;
  }
  return (
    <div className={classes.pengaturanToko}>
      <form onSubmit={handleSubmit} noValidate>
        <TextField
          id='nama'
          name='nama'
          label='Nama Toko'
          margin='normal'
          value={form.nama}
          onChange={handleChange}
          error={error.nama ? true : false}
          helperText={error.nama}
          disabled={isSubmitting}
          fullWidth
          required
        />
        <TextField
          id='alamat'
          name='alamat'
          label='Alamat Toko'
          margin='normal'
          multiline
          rowsMax={3}
          value={form.alamat}
          onChange={handleChange}
          error={error.alamat ? true : false}
          helperText={error.alamat}
          disabled={isSubmitting}
          fullWidth
          required
        />
        <TextField
          id='telepon'
          name='telepon'
          label='No. Telepon Toko'
          margin='normal'
          value={form.telepon}
          onChange={handleChange}
          error={error.telepon ? true : false}
          helperText={error.telepon}
          disabled={isSubmitting}
          fullWidth
          required
        />
        <TextField
          id='website'
          name='website'
          label='Website Toko'
          margin='normal'
          value={form.website}
          onChange={handleChange}
          error={error.website ? true : false}
          helperText={error.website}
          disabled={isSubmitting}
          fullWidth
          required
        />
        <Button
          type='submit'
          className={classes.actionButton}
          variant='contained'
          color='primary'
          disabled={isSubmitting || !isSomethingChange}
        >
          Simpan
        </Button>
      </form>

      <Prompt
        when={isSomethingChange}
        message='Terdapat perubahan yang belum disimpan, apakah anda yakin ingin meninggalkan halaman ini?'
      />
    </div>
  );
}

export default Toko;
