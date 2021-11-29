import React, { useState } from 'react';
import axios from 'axios';
import {
  Link as RouterLink,
  LinkProps as RouterLinkProps,
} from 'react-router-dom';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Card from '@mui/material/Card';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Dialog from '@mui/material/Dialog';
import DialogContentText from '@mui/material/DialogContentText';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

const ListItemLink = (props: { primary: string; to: string }) => {
  const { primary, to } = props;

  const renderLink = React.useMemo(
    () =>
      React.forwardRef<HTMLAnchorElement, Omit<RouterLinkProps, 'to'>>(
        function Link(itemProps, ref) {
          return (
            <RouterLink to={to} ref={ref} {...itemProps} role={undefined} />
          );
        }
      ),
    [to]
  );

  return (
    <li>
      <ListItem button component={renderLink}>
        <ListItemText primary={primary} />
      </ListItem>
    </li>
  );
};

const Home = () => {
  const [sendingAlert, setSendingAlert] = useState(false);
  const [showAlertConfirmation, setShowAlertConfirmation] = useState(false);
  const [sendingAlertError, setSendingAlertError] = useState(false);

  const handleSendAlert = async () => {
    setSendingAlert(true);
    setShowAlertConfirmation(false);
    setSendingAlertError(false);

    try {
      const resp = await axios.get(
        `${process.env.REACT_APP_API_URL}alert/fire/all`
      );
      if (resp.status === 200 && resp.data.success) {
        setShowAlertConfirmation(true);
        setSendingAlert(false);
      } else {
        setSendingAlertError(true);
        setShowAlertConfirmation(true);
        setSendingAlert(false);
      }
    } catch (error) {
      setSendingAlertError(true);
      setShowAlertConfirmation(true);
      setSendingAlert(false);
    }
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <Box
          style={{
            margin: 'auto',
            paddingTop: '5vh',
          }}
          sx={{ width: 360 }}
        >
          <Card variant="outlined">
            <Paper elevation={0}>
              <List aria-label="main links">
                <ListItemLink to="/staff" primary="View All Staff" />
                <ListItemLink
                  to="/staff/on-site"
                  primary="View All Staff Currently On Site"
                />
              </List>
              <Divider />
            </Paper>
          </Card>
        </Box>
        <Box
          style={{
            margin: 'auto',
            paddingTop: '5vh',
          }}
          sx={{ width: 130 }}
        >
          <Button variant="contained" onClick={handleSendAlert}>
            Send Fire Alert
          </Button>
        </Box>
      </Box>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={sendingAlert}
        onClick={() => {}}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Dialog
        open={showAlertConfirmation}
        onClose={() => setShowAlertConfirmation(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {sendingAlertError ? "There was an error while sending the alert. Please try again shortly" : "The alert was sent to staff currently on site. Please proceed to the exit."}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAlertConfirmation(false)} autoFocus>
            Okay
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Home;
