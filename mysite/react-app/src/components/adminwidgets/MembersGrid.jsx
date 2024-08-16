import * as React from "react";

import moment from "moment";
import { API } from "aws-amplify";

import { Typography, Grid } from "@mui/material";
import { DataGrid, GridToolbar, useGridApiRef } from "@mui/x-data-grid";
import * as queries from "../../graphql/queries";

const age = (birthdate) => {
  return moment().diff(birthdate, "years");
};

export function MembersGrid() {
  const [members, setMembers] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  console.log("Loading is " + loading);

  const getMembers = queries.listMembers;

  React.useEffect(() => {
    setLoading(true);
    API.graphql({
      query: getMembers,
    })
      .then((values) => {
        console.log("about to call set members");
        setMembers(values.data.listMembers.items);
      })
      .catch(setLoading(false))
      .finally(setLoading(false));
  }, []);

  React.useEffect(() => {
    console.log("set loading false");
    setLoading(false);
  }, [members]);

  const columns = [
    {
      field: "username",
      headerName: "Username",
      width: 100,
    },
    {
      field: "name",
      headerName: "Name",
      width: 150,
      valueGetter: (params) => {
        return params.row.forename + " " + params.row.surname;
      },
    },
    {
      field: "email",
      headerName: "Email",
      width: 230,
    },
    {
      field: "subscriptionButtonClicked",
      hideable: true,
      value: false,
    },
    {
      field: "subscribed",
      headerName: "In MailChimp?",
      width: 230,
    },
    {
      field: "dateOfBirth",
      headerName: "Date Of Birth",
      width: 150,
      valueGetter: (params) => {
        return new Date(params.row.dateOfBirth).toLocaleDateString();
      },
    },

    {
      field: "gender",
      headerName: "Gender",
      width: 100,
    },
    {
      field: "ethnicity",
      headerName: "Ethnciity",
      width: 100,
    },
    {
      field: "siblings",
      headerName: "Has Siblings?",
      width: 100,
    },
    {
      field: "createdAt",
      headerName: "Date Created",
      width: 180,
      valueGetter: (params) => {
        return (
          new Date(params.row.createdAt).toLocaleDateString() +
          " " +
          new Date(params.row.createdAt).toLocaleTimeString()
        );
      },
    },
    {
      field: "updatedAt",
      headerName: "Last Updated",
      width: 180,
      valueGetter: (params) => {
        return (
          new Date(params.row.updatedAt).toLocaleDateString() +
          " " +
          new Date(params.row.updatedAt).toLocaleTimeString()
        );
      },
    },
  ];

  return (
    <>
      <Grid
        container
        flexDirection="column"
        justifyContent="center"
        spacing={0}
        marginY={1}
        paddingX={{
          xs: "10px",
          sm: "100px",
        }}
      >
        <Typography
          variant="h5"
          align="left"
          color="text.secondary"
          component="p"
        >
          Members
        </Typography>
        <div style={{ height: 600, width: "100%" }}>
          <DataGrid
            onCellClick={(params, event) => event.stopPropagation()}
            getRowId={(row) => row.id}
            components={{ Toolbar: GridToolbar }}
            key={Math.random()}
            title="Enrolments"
            rows={members}
            columns={columns}
            loading={loading}
            pageSize={2}
            disableSelectionOnClick={true}
            rowsPerPageOptions={[2]}
            columnVisibilityModel={{
              subscriptionButtonClicked: false,
            }}
          />
        </div>
      </Grid>
    </>
  );
}
