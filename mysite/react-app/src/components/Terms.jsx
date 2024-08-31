import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import GlobalStyles from "@mui/material/GlobalStyles";
import Container from "@mui/material/Container";

import Header from "./Header.jsx";
import Footer from "./Footer.jsx";


export default function PricingContent(props) {

  return (
    <>
      <GlobalStyles
        styles={{ ul: { margin: 0, padding: 0, listStyle: "none" } }}
      />
      <CssBaseline />

      <Header groups={props.user.groups.map(g => g.name)} />

      <HeroUnenrolled />

      <Footer />
    </>
  )
}

function HeroUnenrolled() {
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
