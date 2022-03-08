import React, { useState } from 'react';
// propstyeps
import PropTypes from 'prop-types';
// material-ui
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
// firebase hooks
import { useFirebase } from '../../../components/FirebaseProvider';
// firebase
import { collection, addDoc } from 'firebase/firestore';
// react router
import { withRouter } from 'react-router-dom';

function AddDialog({ history, open, handleCloseDialog }) {
  const { firestore, user } = useFirebase();
  const produkCol = collection(firestore, `toko/${user.uid}/produk`);
  const [nama, setNama] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSimpan = async (e) => {
    setIsSubmitting(true);
    try {
      if (!nama) {
        throw new Error('Nama produk wajib diisi');
      }
      const produkBaru = await addDoc(produkCol, { nama });
      history.push(`produk/edit/${produkBaru.id}`);
    } catch (error) {
      setError(error.message);
    }
    setIsSubmitting(false);
  };
  return (
    <Dialog
      disableBackdropClick={isSubmitting}
      disableEscapeKeyDown={isSubmitting}
      open={open}
      onClose={handleCloseDialog}
    >
      <DialogTitle>Buat Produk Baru</DialogTitle>
      <DialogContent dividers>
        <TextField
          id='nama'
          label='Nama Produk'
          value={nama}
          onChange={(e) => {
            setError('');
            setNama(e.target.value);
          }}
          helperText={error}
          error={error ? true : false}
          disabled={isSubmitting}
        />
      </DialogContent>
      <DialogActions>
        <Button disabled={isSubmitting} onClick={handleCloseDialog}>
          Batal
        </Button>
        <Button onClick={handleSimpan} color='primary' disabled={isSubmitting}>
          Simpan
        </Button>
      </DialogActions>
    </Dialog>
  );
}

AddDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleCloseDialog: PropTypes.func.isRequired,
};

export default withRouter(AddDialog);
