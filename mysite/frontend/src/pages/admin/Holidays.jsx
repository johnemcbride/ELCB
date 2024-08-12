import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";

import { Box, Typography, Grid, AppBar } from "@mui/material";

import Link from "@mui/material/Link";
import GlobalStyles from "@mui/material/GlobalStyles";
import Container from "@mui/material/Container";

import Loading from "../../components/Loading"
import Header from "../../components/Header";
import { Auth } from "aws-amplify";
import Holidays from "../../components/adminwidgets/Holidays"

export default function HolidaysPage() {
    const [user, setUser] = React.useState({});
    const [groups, setGroups] = React.useState([]);
    const [isLoaded, setIsLoaded] = React.useState(false);

    React.useEffect(() => {
        const fetchedUserDetails = Auth.currentAuthenticatedUser();
        const fetchSession = Auth.currentSession();
        const fontLoaded = document.fonts.load("12px 'Josefin Sans'");

        Promise.all([fetchedUserDetails, fetchSession, fontLoaded]).then(
            (values) => {
                const user = values[0];
                setUser(user);
                const session = values[1];
                setGroups(session.getIdToken().payload["cognito:groups"] || []);

                setIsLoaded(true);
                console.log("shoudl have loaded");
                console.log(values);
            }
        );
    }, []);


    return isLoaded ? (
        <>
            <GlobalStyles
                styles={{ ul: { margin: 0, padding: 0, listStyle: "none" } }}
            />
            <CssBaseline />

            <Header groups={groups} />

            <Grid
                container
                flexDirection="column"
                justifyContent="center"
                spacing={0}
                marginY={1}
            >

                <Holidays />
            </Grid>
            <AppBar position="static" color={"default"}>
                <Footer />
            </AppBar>

        </>
    ) : (
        <Loading />
    );
}

function Footer() {
    return (
        <Container
            maxWidth="md"
            component="footer"
            sx={{
                borderTop: (theme) => `1px solid ${theme.palette.divider}`,
                mt: 8,
                py: [1, 1],
            }}
        >
            <Typography variant="body2" color="text.secondary" align="center">
                {"Copyright © "}
                <Link color="inherit" to="https://www.eastlondoncommunityband.co.uk">
                    East London Community Band
                </Link>{" "}
                {new Date().getFullYear()}
                {"."}
            </Typography>
        </Container>
    );
}
