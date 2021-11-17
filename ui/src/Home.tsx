import * as React from 'react';
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

const Home = () => (
  <Box sx={{ flexGrow: 1 }}>
    <Box
      style={{
        margin: 'auto',
        paddingTop: '5vh'
      }}
      sx={{ width: 360 }}
    >
      <Card variant="outlined">
        <Paper elevation={0}>
          <List aria-label="main links">
            <ListItemLink to="/staff" primary="View All Staff" />
            <ListItemLink to="/drafts" primary="Drafts" />
          </List>
          <Divider />
        </Paper>
      </Card>
    </Box>
  </Box>
);

export default Home;
