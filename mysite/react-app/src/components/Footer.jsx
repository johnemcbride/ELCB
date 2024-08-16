import * as React from "react";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Container from "@mui/material/Container";


export default function Footer() {

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
            <Copyright sx={{ mt: 0 }} />
        </Container>
    )
}



function Copyright(props) {
    return (
        <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            {...props}
        >
            {"Copyright © "}
            <Link color="inherit" to="https://www.eastlondoncommunityband.co.uk">
                East London Community Band
            </Link>{" "}
            {new Date().getFullYear()}
            {"."}
        </Typography>
    );
}