import * as React from "react";
import { Grid, Snackbar, List, ListItem } from "@mui/material";
import { API, graphqlOperation } from "aws-amplify";
import * as queries from "../../graphql/queries";

import { DataGrid, GridToolbar, useGridApiRef } from "@mui/x-data-grid";
import { CheckCircleIcon } from "@mui/icons-material/CheckCircle";
import { CancelIcon } from "@mui/icons-material/Cancel";


const listMembers = /* GraphQL */ `
  query ListMembers(
    $filter: ModelMemberFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listMembers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        username
        email
        forename
        surname
        siblings
        dateOfBirth
        gender
        profile
        ethnicity
        paymentHoliday
        owner
        enrolments(filter: {status: {eq: "paid"}}) {
        items {
          term
        }
      }
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;


export default function Members() {
    const [openSnackbar, setOpenSnackbar] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState("");

    const [data, setData] = React.useState([]);
    const refreshData = async () => {
        let moreData = true;
        let nextToken = null;
        let data = [];

        while (moreData === true) {
            try {
                const response = await API.graphql(
                    graphqlOperation(listMembers, {
                        ...(nextToken !== null ? { nextToken: nextToken } : {}),
                        limit: 500,
                    })
                );
                const members = response.data.listMembers.items;
                if (response.data.listMembers.nextToken !== null) {
                    nextToken = response.data.listMembers.nextToken;
                    console.log("Got next token");
                } else {
                    moreData = false;
                }

                data.push(...members);
            } catch (error) {
                console.error("Error fetching tasks:", error);
                moreData = false;
            }
        }

        setData(data);
    };

    React.useEffect(() => {
        refreshData();
    }, []);

    const handleSnackbarClose = () => {
        setOpenSnackbar(false);
    };


    const enrolledSymbol = '✅'
    const notEnrolledSymbol = '❌'
    const columns = [

        {
            field: "name",
            headerName: "Name",
            width: 250,
            valueGetter: (params) => {
                return params.row.forename + " " + params.row.surname;
            },
        },

        {
            field: "email",
            headerName: "Email",
            width: 350,

        },
        {
            field: "username",
            headerName: "Username",
            width: 350,

        },
        {
            field: "23 Summer",
            headerName: "23 Summer",
            width: 100,
            valueGetter: (params) => {
                return params.row.enrolments.items.filter(enrolment => enrolment.term === '23 Summer').length > 0 ? enrolledSymbol : notEnrolledSymbol
            },

        },
        {
            field: "23 Autumn",
            headerName: "23 Autumn",
            width: 100,
            valueGetter: (params) => {
                return params.row.enrolments.items.filter(enrolment => enrolment.term === '23 Autumn').length > 0 ? enrolledSymbol : notEnrolledSymbol
            },

        },
        {
            field: "24 Spring",
            headerName: "24 Spring",
            width: 100,
            valueGetter: (params) => {
                return params.row.enrolments.items.filter(enrolment => enrolment.term === '24 Spring').length > 0 ? enrolledSymbol : notEnrolledSymbol
            },

        },
        {
            field: "24 Summer",
            headerName: "24 Summer",
            width: 100,
            valueGetter: (params) => {
                return params.row.enrolments.items.filter(enrolment => enrolment.term === '24 Summer').length > 0 ? enrolledSymbol : notEnrolledSymbol
            },

        }]

    return (
        <>
            <Grid xs={12} marginBottom={"100px"}>

                <div style={{ height: 600, width: "95%" }}>
                    <DataGrid
                        onCellClick={(params, event) => event.stopPropagation()}
                        getRowId={(row) => row.id}
                        components={{ Toolbar: GridToolbar }}
                        key={Math.random()}
                        title="Enrolments"
                        rows={data}
                        columns={columns}
                        pageSize={2}
                        disableSelectionOnClick={true}
                        rowsPerPageOptions={[3]}
                        columnVisibilityModel={{
                            subscriptionButtonClicked: false,
                        }}
                    />
                </div>


                <Snackbar
                    open={openSnackbar}
                    autoHideDuration={3000}
                    onClose={handleSnackbarClose}
                    message={snackbarMessage}
                />
            </Grid>
        </>
    );
}