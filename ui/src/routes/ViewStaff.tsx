import React, { useState, useMemo } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { useLocation, useParams } from 'react-router';

const ViewStaff = () => {
  const { state } = useLocation();
  const { staffId } = useParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [staffData, setStaffData] = useState<{
    staffId: string;
    firstName: string;
    lastName: string;
    role: string;
    accessPermission: string;
    currentCardId: string;
  }>();

  const [cardData, setCardData] = useState<{
    cardOnSite: boolean;
    cardNotBeenOnSiteYet?: boolean;
    latestZone?: 'A1' | 'A2' | 'A3';
    numberOfTaps: number;
  }>();

  useMemo(() => {
    console.log(state);
    if (state === null) {
      (async () => {
        const staffResp = await axios.get(
          `${process.env.REACT_APP_API_URL}staff/${staffId}`
        );

        if (staffResp.status === 200) {
          setLoading(false);
          setStaffData(staffResp.data);
        } else {
          setLoading(false);
          setError(true);
        }
      })();
    } else {
      setStaffData(state);
    }
  }, []);

  useMemo(() => {
    if (staffData) {    
      (async () => {
        const cardResp = await axios.get(
          `${process.env.REACT_APP_API_URL}card/on-site/${staffData?.currentCardId}`
        );

        if (cardResp.status === 200) {
          setCardData(cardResp.data);
          console.log(cardData);
        } else {
          setError(true);
        }
      })();
    }
  }, [staffData]);

  return (
    <>
      <Box
        sx={{ flexGrow: 1 }}
        style={{ margin: 'auto', paddingTop: '5vh', maxWidth: '75vw' }}
      >
        <Grid container spacing={2}>
          <Grid item sm={6}>
            <Card style={{ padding: '3vh' }}>
              <Typography sx={{ fontSize: 14 }} color="text.secondary">
                Name:
              </Typography>
              <Typography sx={{ fontSize: 18 }}>
                {staffData?.firstName} {staffData?.lastName}
              </Typography>
              <Typography
                sx={{ fontSize: 14, marginTop: 2 }}
                color="text.secondary"
              >
                Role:
              </Typography>
              <Typography sx={{ fontSize: 18 }}>{staffData?.role}</Typography>
              <Typography
                sx={{ fontSize: 14, marginTop: 2 }}
                color="text.secondary"
              >
                Access Permission:
              </Typography>
              <Typography sx={{ fontSize: 18 }}>
                {staffData?.accessPermission}
              </Typography>
              <Typography
                sx={{ fontSize: 14, marginTop: 2 }}
                color="text.secondary"
              >
                Current Card ID:
              </Typography>
              <Typography sx={{ fontSize: 18 }}>
                {staffData?.currentCardId}
              </Typography>
            </Card>
          </Grid>
          <Grid item sm={6}>
            <Card style={{ padding: '3vh' }}>
              <Typography sx={{ fontSize: 14 }} color="text.secondary">
                Card Active:
              </Typography>
              {!(
                Object(cardData).hasOwnProperty('cardNotBeenOnSiteYet') &&
                cardData?.cardNotBeenOnSiteYet
              ) || cardData?.numberOfTaps >= 1 ? (
                <CheckCircleIcon style={{ color: 'green', marginTop: '10' }} />
              ) : (
                <CancelIcon style={{ color: 'red', marginTop: '10' }} />
              )}
              <Typography
                sx={{ fontSize: 14, marginTop: 2 }}
                color="text.secondary"
              >
                Card On Site:
              </Typography>
              {cardData?.cardOnSite ? (
                <CheckCircleIcon style={{ color: 'green', marginTop: '10' }} />
              ) : (
                <CancelIcon style={{ color: 'red', marginTop: '10' }} />
              )}
              <Typography
                sx={{ fontSize: 14, marginTop: 2 }}
                color="text.secondary"
              >
                Current Zone:
              </Typography>
              <Typography sx={{ fontSize: 18 }}>
                {Object(cardData).hasOwnProperty('latestZone') &&
                cardData?.latestZone
                  ? cardData?.latestZone
                  : 'n/a'}
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default ViewStaff;
