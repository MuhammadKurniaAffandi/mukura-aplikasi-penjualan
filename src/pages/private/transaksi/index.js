import React, { useEffect, useState } from 'react';
// material-ui
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
// icons
import DeleteIcon from '@material-ui/icons/Delete';
import View from '@material-ui/icons/Visibility';
// firebase hook
import { useFirebase } from '../../../components/FirebaseProvider';
// react-firebase-hooks
import { useCollection } from 'react-firebase-hooks/firestore';
import { collection, deleteDoc } from 'firebase/firestore';
// currency
import { currency } from '../../../utils/formatter';
// format date
import format from 'date-fns/format';
import AppPageLoading from '../../../components/AppPageLoading';
// styles
import useStyles from './styles';
// DetailsDialog
import DetailsDialog from './details';

function Transaksi() {
  const classes = useStyles();
  const { firestore, user } = useFirebase();
  const transaksiCol = collection(firestore, `toko/${user.uid}/transaksi`);
  const [snapshot, loading] = useCollection(transaksiCol);
  const [transaksiItems, setTransaksiItems] = useState([]);
  const [details, setDetails] = useState({
    open: false,
    transaksi: {},
  });

  useEffect(() => {
    if (snapshot) {
      setTransaksiItems(snapshot.docs);
    }
  }, [snapshot]);

  const handleDelete = (transaksiDoc) => async (e) => {
    if (window.confirm('Apakah anda yakin ingin menghapus transaksi ini?')) {
      await deleteDoc(transaksiDoc.ref);
    }
  };

  const handleCloseDetails = () => {
    setDetails({
      open: false,
      transaksi: {},
    });
  };

  const handleOpenDetails = (transaksiDoc) => (e) => {
    setDetails({
      open: true,
      transaksi: transaksiDoc.data(),
    });
  };

  if (loading) {
    return <AppPageLoading />;
  }

  return (
    <>
      <Typography variant='h5' component='h1' paragraph>
        Daftar Transaksi
      </Typography>
      {transaksiItems.length <= 0 && (
        <Typography>Belum ada data transaksi</Typography>
      )}
      <Grid container spacing={5}>
        {transaksiItems.map((transaksiDoc) => {
          const transaksiData = transaksiDoc.data();
          return (
            <Grid item key={transaksiDoc.id} xs={12} sm={12} md={6}>
              <Card className={classes.cards}>
                <CardContent className={classes.transaksiSummary}>
                  <Typography variant='h5' noWrap>
                    No: {transaksiData.no}
                  </Typography>
                  <Typography>
                    Total: {currency(transaksiData.total)}
                  </Typography>
                  <Typography>
                    Tanggal:{' '}
                    {format(
                      new Date(transaksiData.tanggal),
                      'DD-MM-YYYY HH:mm'
                    )}
                  </Typography>
                </CardContent>

                <CardActions className={classes.transaksiActions}>
                  <IconButton onClick={handleOpenDetails(transaksiDoc)}>
                    <View />
                  </IconButton>
                  <IconButton>
                    <DeleteIcon onClick={handleDelete(transaksiDoc)} />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>
      <DetailsDialog
        open={details.open}
        handleClose={handleCloseDetails}
        transaksi={details.transaksi}
      />
    </>
  );
}

export default Transaksi;
