import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Link from "@mui/material/Link";
import GlobalStyles from "@mui/material/GlobalStyles";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import { Auth } from "aws-amplify";
import Header from "./Header.jsx";
import moment from "moment";
import { API } from "aws-amplify";
import Loading from "./Loading.jsx";
import CircularProgress from "@mui/material/CircularProgress";
import * as queries from "../graphql/queries";
import { useNavigate, Navigate } from "react-router-dom";
import { createEnrolment as createEnrolmentMutation } from "../graphql/mutations";

import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import FolderIcon from "@mui/icons-material/Folder";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
const age = (birthdate) => {
  return moment().diff(birthdate, "years");
};

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

export default function PricingContent() {
  const [user, setUser] = React.useState({});
  const [groups, setGroups] = React.useState([]);
  const [session, setSession] = React.useState({});
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [isEnrolled, setIsEnrolled] = React.useState(false);
  const [enrolment, setEnrolment] = React.useState(false);

  React.useEffect(() => {
    setIsLoaded(true);
  }, []);
  return isLoaded ? (
    <>
      <GlobalStyles
        styles={{ ul: { margin: 0, padding: 0, listStyle: "none" } }}
      />
      <CssBaseline />
      <Header groups={groups} />

      <HeroUnenrolled user={user} />

      <Footer />
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
      <Copyright sx={{ mt: 0 }} />
    </Container>
  );
}

function HeroUnenrolled({ user }) {
  return (
    <Container
      // disableGutters
      maxWidth="sm"
      component="main"
    >
      <Typography
        sx={{ pt: 8 }}
        component="h1"
        variant="h3"
        align="left"
        color="text.primary"
        gutterBottom
      >
        Our Terms & Conditions
      </Typography>
      <Typography
        variant="h5"
        align="left"
        color="text.secondary"
        component="p"
      >
        BAND INFORMATION
      </Typography>
      <Typography
        sx={{ pt: 4 }}
        variant="h6"
        align="left"
        color="text.secondary"
        component="p"
      >
        Email communication
      </Typography>
      <Typography
        variant="body"
        align="left"
        color="text.secondary"
        component="p"
      >
        East London Community Band sends regular emails to its members and
        updates about special events or rehearsals – we don’t share your email
        address with other organisations.
      </Typography>
      <Typography
        sx={{ pt: 4 }}
        variant="h6"
        align="left"
        color="text.secondary"
        component="p"
      >
        Photography and filming
      </Typography>
      <Typography
        variant="body"
        align="left"
        color="text.secondary"
        component="p"
      >
        East London Community Band performs regularly in public where we take
        photos and record our performances where possible. We use these for
        promoting the band on social media, our website and in print or to
        support funding applications. We assume that you consent to this use
        unless you make it known to us otherwise.
      </Typography>
      <Typography
        sx={{ pt: 4 }}
        variant="h6"
        align="left"
        color="text.secondary"
        component="p"
      >
        Safeguarding
      </Typography>
      <Typography
        variant="body"
        align="left"
        color="text.secondary"
        component="p"
      >
        East London Community Band has a safeguarding policy in place which all
        our members should be aware of. Please read the policy document which is
        available on the band’s Google Drive. A link to the drive is included in
        the member’s weekly email which you will receive once you join band. Our
        contact details info@eastlondoncommunityband.co.uk
        www.eastlondoncommunityband.co.uk
      </Typography>
      <Typography
        sx={{ pt: 4 }}
        variant="h6"
        align="left"
        color="text.secondary"
        component="p"
      >
        Our bank details
      </Typography>
      <Typography
        variant="body"
        align="left"
        color="text.secondary"
        component="p"
      >
        HSBC <br />
        Whitechapel Branch <br />
        East London Community Band <br />
        Sort Code: 40 02 20
        <br />
        Account: 11052640 <br />
      </Typography>
      <Typography
        sx={{ pt: 4 }}
        variant="h6"
        align="left"
        color="text.secondary"
        component="p"
      >
        Our organisation
      </Typography>
      <Typography
        variant="body"
        align="left"
        color="text.secondary"
        component="p"
      >
        We are a volunteer-run charity overseen by a small group of Trustees and
        a committee. We rely on membership fees and grant funding to operate. We
        are always looking for members to help in various roles and especially
        in identifying funding opportunities. Please let us know if you can
        help.
      </Typography>
    </Container>
  );
}

function LoadingButton({ session, tier }) {
  const [isLoading, setIsloading] = React.useState(false);
  return (
    <Button
      disabled={isLoading}
      onClick={() => {
        setIsloading(true);
        // create enrolment
        API.graphql({
          query: createEnrolmentMutation,
          variables: {
            input: { bands: tier.bands, lessons: tier.lessons },
          },
        }).then((res) => {
          API.post("checkout", "/checkout", {
            body: {
              accesskey: session.accessToken,
              enrolmentId: res.data.createEnrolment.id,
            },
          }).then((res) => {
            window.location.replace(res.url);
          });
        });
      }}
      fullWidth
      variant={tier.buttonVariant}
    >
      {isLoading ? (
        <>
          <CircularProgress size={12} /> &nbsp;
        </>
      ) : null}
      {tier.buttonText}
    </Button>
  );
}
