import React, { useEffect, useState } from 'react';
// material-ui
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import UploadIcon from '@material-ui/icons/CloudUpload';
import SaveIcon from '@material-ui/icons/Save';
// firebase hooks
import { useFirebase } from '../../../components/FirebaseProvider';
// firebase firestore
import { doc, setDoc } from 'firebase/firestore';
import { ref, getDownloadURL, uploadString } from 'firebase/storage';
import { useDocument } from 'react-firebase-hooks/firestore';
// komponen AppPageLoading
import AppPageLoading from '../../../components/AppPageLoading';
// Snackbar
import { useSnackbar } from 'notistack';
// style
import useStyles from './styles/edit';
// react-router-dom
import { Prompt } from 'react-router-dom';

function EditProduk({ match }) {
  const classes = useStyles();
  const { firestore, storage, user } = useFirebase();
  const { enqueueSnackbar } = useSnackbar();
  const produkDoc = doc(
    firestore,
    `toko/${user.uid}/produk/${match.params.id}`
  );
  // poitns to the root reference
  const produkStorageRef = ref(storage, `toko/${user.uid}/produk`);
  const [snapshot, loading] = useDocument(produkDoc);
  const [form, setForm] = useState({
    nama: '',
    sku: '',
    harga: 0,
    stok: 0,
    deskripsi: '',
  });
  const [error, setError] = useState({
    nama: '',
    sku: '',
    harga: '',
    stok: '',
    deskripsi: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSomethingChange, setIsSomethingChange] = useState(false);

  useEffect(() => {
    if (snapshot && snapshot.exists) {
      setForm((currentForm) => ({
        ...currentForm,
        ...snapshot.data(),
      }));
    }
  }, [snapshot]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    setError({
      ...error,
      [e.target.name]: '',
    });
    setIsSomethingChange(true);
  };

  const validate = () => {
    const newError = { ...error };
    if (!form.nama) {
      newError.nama = 'Nama Produk wajib diisi';
    }
    if (!form.harga) {
      newError.harga = 'Harga Produk wajib diisi';
    }
    if (!form.stok) {
      newError.stok = 'Stok Produk wajib diisi';
    }
    return newError;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const findError = validate();
    if (Object.values(findError).some((err) => err !== '')) {
      setError(findError);
    } else {
      setIsSubmitting(true);
      try {
        await setDoc(produkDoc, form, { merge: true });
        enqueueSnackbar(`Data Produk berhasil disimpan`, {
          variant: 'success',
        });
        setIsSomethingChange(false);
      } catch (error) {
        enqueueSnackbar(error.message, { variant: 'error' });
      }
      setIsSubmitting(false);
    }
  };

  const handleUploadFile = async (e) => {
    const file = e.target.files[0];
    // mengecek tipe file jika tipenya bukan png atau jpeg
    const reader = new FileReader();
    if (!['image/png', 'image/jpeg'].includes(file.type)) {
      setError((error) => ({
        ...error,
        foto: `Tipe file tidak didukung: ${file.type}`,
      }));
    } else if (file.size >= 512000) {
      setError((error) => ({
        ...error,
        foto: `Ukuran file terlalu besar dari 500kb`,
      }));
    } else {
      reader.onabort = () => {
        setError((error) => ({
          ...error,
          foto: `Proses pembacaan file dibatalkan`,
        }));
      };
      reader.onerror = () => {
        setError((error) => ({
          ...error,
          foto: `File tidak bisa dibaca`,
        }));
      };

      reader.onload = async () => {
        setError((error) => ({
          ...error,
          foto: '',
        }));
        setIsSubmitting(true);
        try {
          const fotoExt = file.name.substring(file.name.lastIndexOf('.'));
          const fotoRef = ref(produkStorageRef, `${match.params.id}${fotoExt}`);

          await uploadString(fotoRef, reader.result, 'data_url').then(
            (snapshot) => {
              enqueueSnackbar(`Foto Produk berhasil diupload`, {
                variant: 'success',
              });
              getDownloadURL(snapshot.ref).then((url) => {
                // set Foto Url
                setForm((form) => ({
                  ...form,
                  foto: url,
                }));
              });
              setIsSomethingChange(true);
            }
          );
        } catch (error) {
          setError((error) => ({
            ...error,
            foto: error.message,
          }));
        }
        setIsSubmitting(false);
      };

      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return <AppPageLoading />;
  }
  return (
    <div>
      <Typography variant='h5' component='h1'>
        Edit Produk: {form.nama}
      </Typography>
      <Grid container alignItems='center' justify='center'>
        <Grid item xs={12} sm={6}>
          <form id='produk-form' onSubmit={handleSubmit} noValidate>
            <TextField
              id='nama'
              name='nama'
              label='Nama Produk'
              margin='normal'
              fullWidth
              required
              value={form.nama}
              onChange={handleChange}
              helperText={error.nama}
              error={error.nama ? true : false}
              disabled={isSubmitting}
            />
            <TextField
              id='sku'
              name='sku'
              label='SKU Produk'
              margin='normal'
              fullWidth
              value={form.sku}
              onChange={handleChange}
              helperText={error.sku}
              error={error.sku ? true : false}
              disabled={isSubmitting}
            />
            <TextField
              id='harga'
              name='harga'
              type='number'
              label='Harga Produk'
              margin='normal'
              fullWidth
              required
              value={form.harga}
              onChange={handleChange}
              helperText={error.harga}
              error={error.harga ? true : false}
              disabled={isSubmitting}
            />
            <TextField
              id='stok'
              name='stok'
              type='number'
              label='Stok Produk'
              margin='normal'
              fullWidth
              required
              value={form.stok}
              onChange={handleChange}
              helperText={error.stok}
              error={error.stok ? true : false}
              disabled={isSubmitting}
            />
            <TextField
              id='deskripsi'
              name='deskripsi'
              label='Deskripsi Produk'
              margin='normal'
              multiline
              rowsMax={3}
              fullWidth
              value={form.deskripsi}
              onChange={handleChange}
              helperText={error.deskripsi}
              error={error.deskripsi ? true : false}
              disabled={isSubmitting}
            />
          </form>
        </Grid>
        <Grid item xs={12} sm={6}>
          <div className={classes.uploadFotoProduk}>
            {form.foto && (
              <img
                src={form.foto}
                className={classes.previewFotoProduk}
                alt={`Foto produk ${form.nama}`}
              />
            )}
            <input
              id='upload-foto-produk'
              className={classes.hideInputFile}
              type='file'
              accept='image/jpeg,image/png'
              onChange={handleUploadFile}
            />
            <label htmlFor='upload-foto-produk'>
              <Button
                disabled={isSubmitting}
                variant='outlined'
                component='span'
              >
                Upload Foto
                <UploadIcon className={classes.iconRight} />
              </Button>
            </label>
            {error.foto && <Typography color='error'>{error.foto}</Typography>}
          </div>
        </Grid>
        <Grid item xs={12}>
          <div className={classes.actionButton}>
            <Button
              form='produk-form'
              type='submit'
              color='primary'
              variant='contained'
              disabled={isSubmitting || !isSomethingChange}
            >
              <SaveIcon className={classes.iconLeft} />
              Simpan
            </Button>
          </div>
        </Grid>
      </Grid>
      <Prompt
        when={isSomethingChange}
        message='Terdapat perubahan yang belum disimpan, apakah anda yakin ingin meninggalkan halaman ini?'
      />
    </div>
  );
}

export default EditProduk;
