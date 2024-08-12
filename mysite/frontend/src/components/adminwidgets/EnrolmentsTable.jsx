import React from "react";
import { Typography, Grid } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";


export default function EnrolmentsTable({ enrolments }) {
  const columns = [
    { field: "term", headerName: "Term", width: 150, resizable: true },

    {
      field: "total",
      headerName: "Total fees (£)",
      width: 100,
      valueFormatter: (params) => "£" + Number(params.value).toFixed(2),
      resizable: true,
    },

    { field: "rate", headerName: "Rate Paid" },
    {
      field: "name",
      headerName: "Member name",
      width: 150,
      resizable: true,
      valueGetter: (params) =>
        `${params.row.firstname} ${params.row.familyname}`,
    },
    {
      field: "ethnicity",
      headerName: "Member ethnicity",
      width: 250,
      resizable: true,
      valueGetter: (params) => `${params.row.main_member.ethnicity}`,
    },
    {
      field: "gender",
      headerName: "Member gender",
      width: 120,
      resizable: true,
      valueGetter: (params) => `${params.row.main_member.gender}`,
    },

    { field: "email", headerName: "Email", width: 300 },

    { field: "paymentName", headerName: "Bill payer name", width: 150 },

    { field: "giftAidConsent", headerName: "Gift Aid Consent", width: 150 },
    { field: "line1", headerName: "Address Line 1", width: 150 },
    { field: "line2", headerName: "Address Line 2", width: 150 },
    { field: "city", headerName: "City", width: 100 },
    { field: "postCode", headerName: "Post Code", width: 100 },

    { field: "stripeRef", headerName: "Stripe", resizable: true, width: 150 },

    {
      field: "bandDesc",
      headerName: "Bands",
      width: 150,
      resizable: true,
    },
    {
      field: "bandRate",
      headerName: "Band Rate Paid (£)",
      width: 150,
      valueFormatter: (params) => "£" + Number(params.value).toFixed(2),
      resizable: true,
    },

    { field: "lessonDesc", headerName: "Lessons", width: 250, resizable: true },
    {
      field: "lessonRate",
      headerName: "Lesson rate paid (£)",
      width: 150,
      valueFormatter: (params) => "£" + Number(params.value).toFixed(2),
      resizable: true,
    },
  ];
  const bands = [
    "Main Band",
    "Big Band",
    "Percussion",
    "Early Music",
    "Premier Band",
    "Jazz Stompers",
    "Chamber Band",
    "Jazz Combo",
  ];

  columns.push(
    ...bands.map((band) => {
      return {
        field: band,
        headerName: band,
        width: 150,
        valueGetter: (params) => {
          return (
            params.row.instrumentsPlayed?.filter((b) => {
              return b.Band == band;
            })[0]?.Instrument || ""
          );
        },
      };
    })
  );
  console.log(columns);

  const rows = enrolments;
  console.log(enrolments);
  return (
    <>
      <Grid
        container
        flexDirection="column"
        justifyContent="center"
        spacing={0}
        marginY={10}
        paddingX={{
          xs: "10px",
          sm: "10px",
        }}
      >
        <Typography
          variant="h5"
          align="left"
          color="text.secondary"
          component="p"
        >
          Details
        </Typography>
        <div style={{ height: 600, width: "100%" }}>
          <DataGrid
            components={{ Toolbar: GridToolbar }}
            key={Math.random()}
            title="Enrolments"
            density={"compact"}
            rows={rows}
            columns={columns}
            pageSize={2}
            rowsPerPageOptions={[2]}
            disableSelectionOnClick
          />
        </div>
      </Grid>
    </>
  );
}
