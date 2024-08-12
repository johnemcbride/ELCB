import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";

import { Typography, Grid, AppBar } from "@mui/material";

import Link from "@mui/material/Link";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import GlobalStyles from "@mui/material/GlobalStyles";
import Container from "@mui/material/Container";

import Loading from "../../components/Loading"
import Header from "../../components/Header";
import { Auth } from "aws-amplify";
import EnrolmentsDashboard from "../../components/adminwidgets/Enrolments"

export default function Enrolments() {
    const [user, setUser] = React.useState({});

    const [term, setTerm] = React.useState("24 Summer");
    const [groups, setGroups] = React.useState([]);
    const [isLoaded, setIsLoaded] = React.useState(false);



    const handleTermChange = (event) => {

        setTerm(event.target.value);
    };


    console.log(term)
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
                flexDirection="row"
                justifyContent="center"
                spacing={0}
                marginY={1}
            >
                <Grid xs={12}>
                    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                        <InputLabel id="term">Term</InputLabel>
                        <Select
                            labelId="term-label"
                            id="term-simple-select"
                            value={term}
                            label="Term"
                            onChange={handleTermChange}
                        >
                            <MenuItem value={'24 Summer'} >24 Summer</MenuItem>
                            <MenuItem value={'24 Spring'} >24 Spring</MenuItem>
                            <MenuItem value={'23 Autumn'} >23 Autumn</MenuItem>
                            <MenuItem value={'23 Summer'}>23 Summer</MenuItem>
                        </Select>
                    </FormControl>

                </Grid>

                <EnrolmentsDashboard term={term} />
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
