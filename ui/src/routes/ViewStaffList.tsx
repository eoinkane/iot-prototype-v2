import React, { useState, useMemo } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import MaterialTable from 'material-table';
import { useNavigate } from 'react-router';

const ViewStaffList = () => {
  const [error, setError] = useState(false);
  const [selectionWarning, setSelectionWarning] = useState<
    boolean | undefined
  >();
  const [selectedRows, setSelectedRows] = useState<any>([]);
  const navigate = useNavigate();
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

  const rowSelectedHandler = (e: any) => {
    if (e.length > 1) {
      setSelectionWarning(true);
    } else {
      setSelectionWarning(undefined);
    }
    setSelectedRows(e);
  };

  const selectButtonHandler = () => {
    if (!selectionWarning && selectedRows.length === 1) {
      console.log('moving to details');
      navigate(`/staff/${selectedRows[0].staffId}`, { state: selectedRows[0] });
    }
  };

  if (!loading && !error && staff) {
    return (
      <>
        <Grid
          container
          spacing={2}
          style={{ margin: 'auto', paddingTop: '5vh', maxWidth: '75vw' }}
        >
          <Grid item sm={10}>
            {selectionWarning ? (
              <Alert
                style={{ backgroundColor: 'rgb(229, 246, 253)' }}
                severity="info"
              >
                Only one row can be selected at a time.
              </Alert>
            ) : (
              <p></p>
            )}
          </Grid>
          <Grid item sm={2} style={{ marginLeft: 'auto' }}>
            <Button
              variant="contained"
              disabled={!selectionWarning && selectedRows.length !== 1}
              style={{
                color: !selectionWarning && selectedRows.length !== 1 ? 'rgba(0, 0, 0, 0.26)': '#fff',
                backgroundColor: !selectionWarning && selectedRows.length !== 1 ? 'rgba(0, 0, 0, 0.12)' : '#1976d2',
                borderRadius: '4px',
                fontFamily: 'Roboto, Helvetica, Arial,sans-serif',
                fontWeight: '500',
                fontSize: '0.875rem',
                lineHeight: '1.75',
                letterSpacing: '0.02857em',
                textTransform: 'uppercase',
                minWidth: '64px',
                padding: '6px 16px',
              }}
              onClick={selectButtonHandler}
            >
              Select
            </Button>
          </Grid>
        </Grid>

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
            options={{
              search: true,
              filtering: true,
              selection: true,
            }}
            onSelectionChange={rowSelectedHandler}
            data={staff}
            title="All Staff"
          />
        </Box>
      </>
    );
  } else {
    return <>There has been a problem</>;
  }
};

export default ViewStaffList;
