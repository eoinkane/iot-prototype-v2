import React, { useState, useMemo } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import MaterialTable from 'material-table';

const ViewStaff = () => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [staff, setStaff] = useState(undefined);

  useMemo(() => {
    (async () => {
      const resp = await axios.get(`${process.env.REACT_APP_API_URL}staff`);

      if (resp.status === 200) {
        setLoading(false);
        setStaff(resp.data);
      } else {
        setLoading(false);
        setError(true);
      }
    })();
  }, []);

  if (!loading && !error && staff) {
    return (
      <Box
        sx={{ flexGrow: 1 }}
        style={{ margin: 'auto', paddingTop: '5vh', maxWidth: '75vw' }}
      >
        <MaterialTable
          columns={[
            { title: 'Staff ID', field: 'staffId' },
            { title: 'First Name', field: 'firstName' },
            { title: 'Last Name', field: 'lastName' },
            { title: 'Role', field: 'role' },
            { title: 'Access Permission', field: 'accessPermission' },
            { title: 'Current Card ID', field: 'currentCardId' },
          ]}
          data={staff}
          title="Demo Title"
        />
      </Box>
    );
  } else {
    return (
      <>
      There has been a problem
      </>
    )
  }
};

export default ViewStaff;
