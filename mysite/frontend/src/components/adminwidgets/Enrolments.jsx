import * as React from "react";
import { Grid, Snackbar } from "@mui/material";
import { BarChartComponent } from "./BarChart";
import { API, graphqlOperation } from "aws-amplify";
import EnrolmentsTable from "./EnrolmentsTable";
import * as subscriptions from "../../graphql/subscriptions";

const getZeroPaddedDate = () => {
    const date = new Date();

    // Get day, month, and year
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear());

    // Combine the parts and format the date

    const formattedDate = `${day}/${month}/${year}`;

    console.log(formattedDate);
    return formattedDate;
};

const enrolmentsByTermAndCreatedAt = /* GraphQL */ `
  query EnrolmentsByTermAndCreatedAt(
    $term: String!
    $createdAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelEnrolmentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    enrolmentsByTermAndCreatedAt(
      term: $term
      createdAt: $createdAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        bands
        status
        rate
        term
        memberEnrolmentsId
        bandMembershipType
        bandDesc
        bandRate
        lessons
        lessonDesc
        lessonRate
        stripeRef
        total
        giftAidConsent
        paymentName
        city
        line1
        line2
        postCode
        email
        firstname
        familyname
        instrumentsPlayed {
          Band
          Instrument
        }
        main_member {
          gender
          ethnicity
        }
        owners
        owner
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;

export default function Enrolments({ term }) {
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
                    graphqlOperation(enrolmentsByTermAndCreatedAt, {
                        term: term,
                        sortDirection: "DESC",
                        ...(nextToken !== null ? { nextToken: nextToken } : {}),
                        limit: 500,
                        filter: {
                            status: {
                                eq: "paid",
                            },
                        },
                    })
                );
                const enrolments = response.data.enrolmentsByTermAndCreatedAt.items;
                if (response.data.enrolmentsByTermAndCreatedAt.nextToken !== null) {
                    nextToken = response.data.enrolmentsByTermAndCreatedAt.nextToken;
                    console.log("Got next token");
                } else {
                    moreData = false;
                }

                data.push(...enrolments);
            } catch (error) {
                console.error("Error fetching tasks:", error);
            }
        }

        setData(data);
    };

    const handleSnackbarClose = () => {
        setOpenSnackbar(false);
    };

    React.useEffect(() => {
        refreshData();


    }, [term]);

    React.useEffect(() => {
        const subscription = API.graphql(
            graphqlOperation(subscriptions.onCreateApplicationEventLog, {
                dateString: getZeroPaddedDate,
            })
        ).subscribe({
            next: (response) => {
                console.log("Data is Refreshing");
                setSnackbarMessage(
                    `${response.value.data.onCreateApplicationEventLog.message}`
                );
                setOpenSnackbar(true);
                refreshData();
            },
            error: (error) => {
                console.log("Subscription error");
                console.error(error);
            },
        });
    }, []);

    //
    // Tally Up Bands
    //
    const bands = {
        "Big Band": 0,
        "Early Music": 0,
        "Chamber Band": 0,
        "Jazz Combo": 0,
        "Jazz Stompers": 0,
        "Lessons Only": 0,
        "Main Band": 0,
        Percussion: 0,
        "Premier Band": 0,
        "None Selected": 0,
    };
    const gender = { MALE: 0, FEMALE: 0, PREFERNOTSAY: 0, OTHER: 0 };
    const ethnicity = {};
    const instruments = {};
    for (const enrolment of data) {
        if (enrolment.bands === "none") {
            bands["Lessons Only"]++;
        } else {
            if (enrolment.instrumentsPlayed) {
                if (enrolment.instrumentsPlayed.length === 0) {
                    bands["None Selected"]++;
                } else {
                    for (const band of enrolment.instrumentsPlayed
                        ? enrolment.instrumentsPlayed
                        : []) {
                        bands[band.Band]++;
                    }

                    let uniqueInstruments = {}
                    for (const band of enrolment.instrumentsPlayed
                        ? enrolment.instrumentsPlayed
                        : []) {
                        uniqueInstruments[band.Instrument] = true

                    }

                    for (const uniqueInstrument of Object.keys(uniqueInstruments)) {
                        if (instruments.hasOwnProperty(uniqueInstrument)) {
                            instruments[uniqueInstrument]++;
                        } else {
                            instruments[uniqueInstrument] = 1;
                        }
                    }
                }
            } else {
                bands["None Selected"]++;
            }
        }
        if (ethnicity.hasOwnProperty(enrolment.main_member?.ethnicity)) {
            ethnicity[enrolment.main_member.ethnicity]++;
        } else {
            ethnicity[enrolment.main_member.ethnicity] = 1;
        }
        gender[enrolment.main_member.gender]++;
    }
    return (
        <>
            <Grid xs={12} sm={6} md={3} marginBottom={"100px"}>
                <BarChartComponent
                    data={Object.entries(ethnicity)
                        .map((entry) => ({
                            name: entry[0],
                            value: entry[1],
                        }))
                        .filter((entry) => entry.value !== 0)
                        .sort((a, b) => b.value - a.value)}
                    title={"Ethnicity Split"}
                />
            </Grid>
            <Grid xs={12} sm={6} md={3} marginBottom={"100px"}>
                <BarChartComponent
                    data={Object.entries(gender)
                        .map((entry) => ({
                            name: entry[0],
                            value: entry[1],
                        }))
                        .filter((entry) => entry.value !== 0)
                        .sort((a, b) => b.value - a.value)}
                    title={"Gender Split"}
                />
            </Grid>
            <Grid xs={12} sm={6} md={3} marginBottom={"100px"}>
                <BarChartComponent
                    data={Object.entries(bands)
                        .map((entry) => ({
                            name: entry[0],
                            value: entry[1],
                        }))
                        .filter((entry) => entry.value !== 0)
                        .sort((a, b) => b.value - a.value)}
                    title={"Bands"}
                />
            </Grid>
            <Grid xs={12} sm={6} md={3} marginBottom={"100px"}>
                <BarChartComponent
                    data={Object.entries(instruments)
                        .map((entry) => ({
                            name: entry[0],
                            value: entry[1],
                        }))
                        .filter((entry) => entry.value !== 0)
                        .sort((a, b) => b.value - a.value)}
                    title={"Instruments"}
                />
            </Grid>

            <EnrolmentsTable enrolments={data} />

            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={handleSnackbarClose}
                message={snackbarMessage}
            />
        </>
    );
}