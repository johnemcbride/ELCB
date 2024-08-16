import * as React from "react";
import { Grid, Snackbar } from "@mui/material";
import { TransferList } from "./TransferList.jsx";
import { API, graphqlOperation } from "aws-amplify";
import * as queries from "../../graphql/queries";

export default function PaymentHolidays() {
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
                    graphqlOperation(queries.listMembers, {
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

    let payingMembers = data
        .filter((mem) => !mem.paymentHoliday)
        .sort((a, b) => a.surname?.localeCompare(b.surname));

    let nonPayingMembers = data
        .filter((mem) => mem.paymentHoliday)
        .sort((a, b) => a.surname?.localeCompare(b.surname));

    console.log("sorted");
    console.log(payingMembers);
    return (
        <>
            <Grid xs={12} sm={6} md={3} marginBottom={"100px"}>
                <TransferList
                    items={data}
                    leftIn={payingMembers}
                    rightIn={nonPayingMembers}
                />

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