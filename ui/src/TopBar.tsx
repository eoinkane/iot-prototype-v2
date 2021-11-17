import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import SyncIcon from '@mui/icons-material/Sync';
import HomeIcon from '@mui/icons-material/Home';

const refreshHandler = () => {
  window.location.reload();
};

const TopBar = () => {
  const navigator = useNavigate();
  const homeHandler = () => {
    navigator('/');
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" style={{ backgroundColor: '#1976d2' }}>
        <Toolbar>
          <IconButton
            size="medium"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={homeHandler}
            style={{
              color: '#fff',
            }}
          >
            <HomeIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1 }}
            style={{
              fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
              color: '#fff',
            }}
          >
            IoT Proto App
          </Typography>
          <Button
            color="inherit"
            onClick={refreshHandler}
            style={{ color: '#fff' }}
          >
            Refresh
            <SyncIcon />
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default TopBar;
