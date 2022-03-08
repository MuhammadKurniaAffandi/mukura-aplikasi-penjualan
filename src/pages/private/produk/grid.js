import React, { useState, useEffect } from 'react';
// material-ui
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import ImageIcon from '@material-ui/icons/Image';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

// styles
import useStyles from './styles/grid';
// page komponen
import AddDialog from './add';
import AppPageLoading from '../../../components/AppPageLoading';
// firebase hooks
import { useFirebase } from '../../../components/FirebaseProvider';
// firebase firestore
import { collection, deleteDoc, doc } from 'firebase/firestore';
import { deleteObject, ref } from 'firebase/storage';
// react-firebase-hooks
import { useCollection } from 'react-firebase-hooks/firestore';
// currency from utils
import { currency } from '../../../utils/formatter';
// react-router-dom
import { Link } from 'react-router-dom';

function GridProduk() {
  const classes = useStyles();
  const { firestore, user, storage } = useFirebase();
  const produkColl = collection(firestore, `toko/${user.uid}/produk`);
  const [snapshot, loading] = useCollection(produkColl);
  const [produkItems, setProdukItems] = useState([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);

  useEffect(() => {
    if (snapshot) {
      setProdukItems(snapshot.docs);
    }
  }, [snapshot]);

  const handleDelete = (produkDoc) => async (e) => {
    if (window.confirm('Yakin ingin menghapus produk ini?')) {
      try {
        await deleteDoc(
          doc(firestore, `toko/${user.uid}/produk/${produkDoc.id}`)
        );
        if (produkDoc.data().foto) {
          await deleteObject(ref(storage, produkDoc.data().foto));
        }
      } catch (error) {
        alert('error delete produk', error);
      }
    }
  };

  if (loading) {
    return <AppPageLoading />;
  }
  return (
    <>
      <Typography variant='h5' component='h1' paragraph>
        Daftar Produk
      </Typography>
      {produkItems.length <= 0 && (
        <Typography>Belum ada data produk</Typography>
      )}
      <Grid container spacing={5}>
        {produkItems.map((produkDoc) => {
          const produkData = produkDoc.data();
          return (
            <Grid key={produkDoc.id} item={true} xs={12} sm={12} md={6} lg={4}>
              <Card className={classes.card}>
                {produkData.foto && (
                  <CardMedia
                    className={classes.foto}
                    image={produkData.foto}
                    title={produkData.nama}
                  />
                )}
                {!produkData.foto && (
                  <div className={classes.fotoPlacholder}>
                    <ImageIcon size='large' color='disabled' />
                  </div>
                )}
                <CardContent className={classes.produkDetails}>
                  <Typography variant='h5' noWrap>
                    {produkData.nama}
                  </Typography>
                  <Typography variant='subtitle1'>
                    Harga: {currency(produkData.harga)}
                  </Typography>
                  <Typography variant='subtitle1'>
                    Stok: {produkData.stok}
                  </Typography>
                </CardContent>
                <CardActions className={classes.produkActions}>
                  <IconButton
                    component={Link}
                    to={`/produk/edit/${produkDoc.id}`}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={handleDelete(produkDoc)}>
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>
      <Fab
        color='primary'
        className={classes.fab}
        onClick={() => {
          setOpenAddDialog(true);
        }}
      >
        <AddIcon />
      </Fab>
      <AddDialog
        open={openAddDialog}
        handleCloseDialog={() => {
          setOpenAddDialog(false);
        }}
      />
    </>
  );
}

export default GridProduk;
