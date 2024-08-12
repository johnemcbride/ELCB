import * as React from "react";
import AppBar from "@mui/material/AppBar";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import Paper from "@mui/material/Paper";
import FormHelperText from "@mui/material/FormHelperText";
import FormLabel from "@mui/material/FormLabel";
import Button from "@mui/material/Button";
import Radio from "@mui/material/Radio";
import DoneIcon from "@mui/icons-material/Done";

import { Analytics } from "aws-amplify";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepContent from "@mui/material/StepContent";
import RadioGroup from "@mui/material/RadioGroup";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Link from "@mui/material/Link";
import Divider from "@mui/material/Divider";
import GlobalStyles from "@mui/material/GlobalStyles";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import { Auth } from "aws-amplify";
import Header from "./Header";
import moment from "moment";
import { API } from "aws-amplify";
import Loading from "./Loading";
import CircularProgress from "@mui/material/CircularProgress";
import * as queries from "../graphql/queries";
import { useNavigate, Navigate } from "react-router-dom";
import { createEnrolment as createEnrolmentMutation } from "../graphql/mutations";

import StepWizard from "react-step-wizard";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import FormGroup from "@mui/material/FormGroup";
import Checkbox from "@mui/material/Checkbox";
import FolderIcon from "@mui/icons-material/Folder";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import CancelIcon from "@mui/icons-material/Cancel";

import InstrumentBandPicker from "./userwidgets/InstrumentBandPicker"

const age = (birthdate) => {
  return moment().diff(birthdate, "years");
};




export default function PricingContent({ groups, session }) {

  const [isLoaded, setIsLoaded] = React.useState(false);
  const [state, setState] = React.useState({});

  React.useEffect(() => {
    Analytics.record({ name: "enrolmentManagementVisit" });
    API.get("enrolmentmanager", "/enrolmentstatus", {
      headers: {
        Authorization: session?.idToken?.getJwtToken(),
      },
    }).then((state) => {
      state.accessToken = session?.idToken?.getJwtToken();
      setState(state);
      setIsLoaded(true);
    }).catch(console.log);;
  }, [session]);



  const isTest = window.location.hostname.includes('eastlondoncommunity') ? false : true;

  return isLoaded ? (

    <>
      <GlobalStyles
        styles={{ ul: { margin: 0, padding: 0, listStyle: "none" } }}
      />
      <CssBaseline />



      {

        state?.currentterm?.termInSession || isTest ? (
          // payment open
          state.currentEnrolment?.status === "paid" ? (
            <>
              <HeroEnrolled state={state} />
              <MembershipSummary state={state} />
            </>
          ) : (
            <>
              <HeroUnenrolled state={state} />
              <VerticalLinearStepper state={state} />
            </>
          ))
          :
          (
            <TermClosed state={state} />
          )


      }

    </>
  ) : (
    <Loading />
  );
}

function VerticalLinearStepper({ state }) {
  console.log('Vertical Line Stepper state')
  console.log(state)
  console.log(state.prodCat.products.bands.options['small'])

  const [instrumentsPlayed, setInstrumentsPlayed] = React.useState([]);
  let newState = {};
  for (const product of Object.keys(state.prodCat.products)) {
    newState[product] = "none";
  }
  newState.giftaidconsent = false;
  newState.termsandconditions = false;
  const [productSelection, setProductSelection] = React.useState(newState);

  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  const handleBackInstruments = () => {
    setInstrumentsPlayed([])
    handleBack()
  };

  const handleReset = () => {
    setActiveStep(0);
  };
  return (
    <Container
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "baseline",
        mb: 2,
      }}
      direction="column"
    >
      <Stepper activeStep={activeStep} orientation="vertical">
        <Step key={1}>
          <StepLabel>Which bands do you want to join?</StepLabel>
          <StepContent>
            {" "}
            <MemberShipPicker
              state={state}
              wizardState={productSelection}
              setWizardState={setProductSelection}
              nextStep={handleNext}
              product="bands"
            />
          </StepContent>
        </Step>
        <Step key={2} disabled={productSelection['bands'] === 'none'}>
          <StepLabel>What instruments do you play?</StepLabel>
          <StepContent>
            {" "}
            <InstrumentBandPicker
              bandOptions={state.prodCat.products.bands.options[productSelection['bands']] || []}
              instrumentsPlayed={instrumentsPlayed}
              setInstrumentsPlayed={setInstrumentsPlayed}
            />


            <Grid container direction="row" justifyContent={"space-between"}>
              {" "}
              <Grid xs={5} item>

                <Button onClick={handleBackInstruments} variant="contained" fullWidth>
                  Back
                </Button>

              </Grid>
              <Grid xs={5} item>
                <Button
                  id={"tostep2"}
                  onClick={handleNext}
                  variant="contained"
                  fullWidth
                  disabled={!instrumentsPlayed.length > 0 && productSelection['bands'] !== 'none'}

                >
                  Next
                </Button>
              </Grid>
            </Grid>



          </StepContent>
        </Step>
        <Step key={3}>
          <StepLabel>
            Do you want any lessons?{" "}
            <b>
              (Please check availability at front desk before paying for
              lessons)
            </b>
          </StepLabel>
          <StepContent>
            {" "}
            <MemberShipPicker
              state={state}
              wizardState={productSelection}
              setWizardState={setProductSelection}
              nextStep={handleNext}
              prevStep={handleBack}
              product="lessons"
            />
          </StepContent>
        </Step>
        <Step key={4}>
          <StepLabel>
            Provide Gift Aid consent (optional, but strongly requested)
          </StepLabel>
          <StepContent>
            {" "}
            <GiftAidConsent
              state={state}
              wizardState={productSelection}
              setWizardState={setProductSelection}
              nextStep={handleNext}
              previousStep={handleBack}
            />
          </StepContent>
        </Step>
        <Step key={5}>
          <StepLabel>Confirm reading band information</StepLabel>
          <StepContent>
            {" "}
            <AgreeTerms
              state={state}
              wizardState={productSelection}
              setWizardState={setProductSelection}
              nextStep={handleNext}
              previousStep={handleBack}
            />
          </StepContent>
        </Step>
        <Step key={6}>
          <StepLabel>
            Confirm details before providing payment information on the next
            page
          </StepLabel>
          <StepContent>
            {" "}
            <ConfirmBeforeCheckout
              state={state}
              wizardState={productSelection}
              setWizardState={setProductSelection}
              nextStep={handleNext}
              previousStep={handleBack}
              instrumentsPlayed={instrumentsPlayed}
            />
          </StepContent>
        </Step>
        {/* {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel
              optional={
                index === 2 ? (
                  <Typography variant="caption">Last step</Typography>
                ) : null
              }
            >
              {step.label}
            </StepLabel>
            <StepContent>
              <Typography>{step.description}</Typography>
              <Box sx={{ mb: 2 }}>
                <div>
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Continue
                  </Button>
                  <Button
                    disabled={index === 0}
                    onClick={handleBack}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Back
                  </Button>
                </div>
              </Box>
            </StepContent>
          </Step>
        ))} */}
      </Stepper>
    </Container>
  );
}


function HeroUnenrolled({ state }) {

  return (
    <Container
      // disableGutters
      maxWidth="sm"
      component="main"
      sx={{ pt: 2, pb: 2 }}
    >
      <Typography
        component="h1"
        variant="h5"
        align="left"
        color="text.primary"
        gutterBottom
      >
        {state.member.forename}, please pay your membership fees for the term.
      </Typography>
      <Typography
        variant="h5"
        align="left"
        color="text.secondary"
        component="p"
      >
        {state.usertype === "under30" ? (
          <>
            Do you have a sibling in band? Update your profile to make sure you
            pay the cheaper sibling rate. <br />
          </>
        ) : null}
        {state.usertype === "siblings" ? (
          <>
            You have indicated that you have a sibling in the band. Therefore
            you shall pay the cheaper sibling rate. If this is no longer the
            case, please update the information in your profile.
            <br />
          </>
        ) : null}
      </Typography>
    </Container>
  );
}



function HeroEnrolled({ state }) {
  const queryParameters = new URLSearchParams(window.location.search);
  const thankYou = queryParameters.get("thanks");

  return (
    <Container
      // disableGutters
      maxWidth="sm"
      component="main"
      sx={{ pt: 8, pb: 6 }}
    >
      <Typography
        component="h1"
        variant="h3"
        align="left"
        color="text.primary"
        gutterBottom
      >
        {thankYou
          ? ` ${state.member.forename}, you've signed up. Thank you! `
          : ` ${state.member.forename}, welcome back! `}
      </Typography>
      <Typography
        variant="h5"
        align="left"
        color="text.secondary"
        component="p"
      >
        Your enrolment details are below. Please make sure your profile is up to
        date. Changed band? Started lessons? We need the correct information to
        keep things running smoothly. Just click the profile button above and
        check your details are correct. Thanks.
      </Typography>
    </Container>
  );
}


function TermClosed({ state }) {
  return (
    <Container
      // disableGutters
      maxWidth="sm"
      component="main"
      sx={{ pt: 2, pb: 2, flexGrow: 1, display: 'flex', flexDirection: 'column' }
      }
    >
      <Typography
        component="h1"
        variant="h5"
        align="left"
        color="text.primary"
        gutterBottom
      >
        {state.member.forename}, we are not currently taking payment for term.
      </Typography>

    </Container>
  );
}

function MemberShipPicker({
  state,
  wizardState,
  setWizardState,
  product,
  ...props
}) {
  const [isLoading, setIsloading] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [helperText, setHelperText] = React.useState("");

  const handleRadioChange = (event) => {
    // need key and value to update product selection
    const name = event.target.name;
    const value = event.target.value;
    let newState = JSON.parse(JSON.stringify(wizardState));
    newState[name] = value;
    setWizardState(newState);
  };

  const [checked, setChecked] = React.useState(false);

  const handleChange = (event) => {
    setChecked(!checked);
  };

  const GBP = new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  });
  return (
    <>
      <Container maxWidth="sm"
        component="main"
        sx={{ pt: 2, pb: 2, flexGrow: 1, display: 'flex', flexDirection: 'column' }}

      >
        <form>
          <Grid
            container
            direction="column"
            alignItems={"left"}
            alignContent={"left"}
            justifyContent={"flex-start"}
          >

            <Grid xs={12} item>
              <FormControl error={error} variant="standard">
                <RadioGroup
                  aria-labelledby="demo-error-radios"
                  id={"pickband"}
                  name={product}
                  value={wizardState[product]}
                  onChange={handleRadioChange}
                >
                  {Object.values(state.prodCat.products[product].options)
                    .filter((opt) => (opt.available ? true : false))
                    .map((option) => {

                      return (
                        <>
                          <Typography
                            component="p"
                          //variant="h1"
                          //color="green"
                          >
                            <FormControlLabel
                              style={{
                                paddingX: 0,
                                marginX: 0,
                                marginRight: 0,
                              }}
                              id={option.id}
                              value={option.id}
                              control={<Radio />}
                            />
                            {option.description}
                            {option.features?.includes
                              ? [
                                " includes ",
                                <b>{option.features.includes}</b>,
                                " of:",
                              ]
                              : null}
                          </Typography>
                          {option.features ? (
                            <Grid container paddingBottom={2}>
                              {option?.features?.options.map((option) => {
                                return (
                                  <Grid item xs="6">
                                    {option.description}
                                  </Grid>
                                );
                              })}
                            </Grid>
                          ) : null}
                        </>
                      );
                    })}
                </RadioGroup>

                <Typography component="p" variant="h9" color="green">
                  {state.prodCat.products[product].options[wizardState[product]]
                    .price > 0
                    ? "Cost for " +
                    product +
                    " is " +
                    GBP.format(
                      state.prodCat.products[product].options[
                        wizardState[product]
                      ].price
                    ) +
                    " (" +
                    state.prodCat.ratesApplied +
                    " rate)"
                    : null}
                </Typography>
              </FormControl>
            </Grid>
          </Grid>

          <Grid container direction="row" justifyContent={"space-between"}>
            {" "}
            <Grid xs={5} item>
              {props.prevStep ? (
                <Button onClick={props.prevStep} variant="contained" fullWidth>
                  Back
                </Button>
              ) : null}
            </Grid>
            <Grid xs={5} item>
              <Button
                id={"tostep2"}
                onClick={props.nextStep}
                variant="contained"
                fullWidth
              >
                Next
              </Button>
            </Grid>
          </Grid>
          <Typography paddingY={2} component="p" variant="body" color="red">
            {helperText}
          </Typography>
        </form>
      </Container>


    </>
  );
}

function MembershipSummary({ state }) {
  const GBP = new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  });

  return (
    <>
      <Container
        sx={{
          display: "flex",
          justifyContent: "left",
          alignItems: "baseline",
          mb: 2,
          width: "100%",
        }}
        maxWidth="sm"
        direction="column"
      >
        <Grid
          container
          direction="column"
          alignItems={"left"}
          alignContent={"left"}
          justifyContent={"flex-start"}
        >
          Your membership for the current term ({state.currentterm.term.name})
          includes:
          <Grid xs={12} item>
            <List>
              {Object.keys(state.prodCat.products).map((product) => {
                const option =
                  state.prodCat.products[product].options[
                  state.currentEnrolment[product]
                  ];
                return (
                  <ListItem alignItems="flex-start">
                    <ListItemIcon>
                      <DoneIcon />
                    </ListItemIcon>
                    <ListItemText>
                      <Typography
                        component="p"
                      //variant="h1"
                      //color="green"
                      >
                        {option.description}
                        {option.features?.includes
                          ? [
                            " including ",
                            <b>{option.features.includes}</b>,
                            " of:",
                          ]
                          : null}
                      </Typography>
                      {option.features ? (
                        <Grid container paddingBottom={2}>
                          {option?.features?.options.map((option) => {
                            return (
                              <Grid item xs="6">
                                {option.description}
                              </Grid>
                            );
                          })}
                        </Grid>
                      ) : null}
                    </ListItemText>
                  </ListItem>
                );
              })}
            </List>
          </Grid>
        </Grid>
      </Container>

      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "baseline",
          mb: 2,
        }}
        direction="column"
      ></Container>
    </>
  );
}
function GiftAidConsent({ state, wizardState, setWizardState, ...props }) {

  const [isDisabled, setIsDisabled] = React.useState(false);
  const handleClick = (event) => {
    // need key and value to update product selection
    const name = event.target.name;
    const value = event.target.checked;
    let newState = JSON.parse(JSON.stringify(wizardState));
    newState[name] = value;
    setWizardState(newState);
  };

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const GBP = new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  });
  return (
    <>
      <Container
        // disableGutters
        maxWidth="sm"
        component="main"
        sx={{ pt: 1, pb: 6 }}
      >
        <Grid
          container
          justifyContent="space-between"
          direction="row"
          alignItems={"top"}
        >
          <Box
            component="img"
            sx={{
              height: 32,
              marginY: 1,
            }}
            alt="Gift Aid It"
            src="/giftaid.svg.png"
          />
          Charity no 1142255
        </Grid>
        As a registered charity we can claim Gift Aid on Band Membership fees
        and donations given by tax paying members. This means we get an extra
        25p in every pound you give, at no extra cost to you.
        <FormControlLabel
          control={<Checkbox />}
          id={"giftaidcheck"}
          onClick={handleClick}
          checked={wizardState.giftaidconsent}
          size="large"
          sx={{ alignItems: "flex-start" }}
          name="giftaidconsent"
          label="Please treat as
          Gift Aid donations all qualifying money made paid to the East London
          Community Band. I confirm I have paid or will pay an amount of Income
          Tax and/or Capital Gains Tax for each tax year (6 April to 5 April) that
          is at least equal to the amount of tax that all the charities or
          Community Amateur Sports Clubs (CASCs) that I donate to will reclaim on
          my gifts for that tax year. I understand that other taxes such as VAT
          and Council Tax do not qualify. I understand the charity will reclaim
          25p of tax on every qualifying £1.00 that I give."
        />
        <Grid container direction="row" justifyContent={"space-between"}>
          {" "}
          <Grid xs={5} item>
            <Button onClick={props.previousStep} fullWidth variant="contained">
              Back
            </Button>
          </Grid>
          <Grid xs={5} item>
            <Button
              id={"tostep4"}
              onClick={props.nextStep}
              variant="contained"
              fullWidth
            >
              Next
            </Button>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

function AgreeTerms({ state, wizardState, setWizardState, ...props }) {

  const [isDisabled, setIsDisabled] = React.useState(false);
  const handleClick = (event) => {
    // need key and value to update product selection
    const name = event.target.name;
    const value = event.target.checked;
    let newState = JSON.parse(JSON.stringify(wizardState));
    newState[name] = value;
    setWizardState(newState);
  };

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const GBP = new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  });
  return (
    <>
      <Container
        // disableGutters
        maxWidth="sm"
        component="main"
        sx={{ pt: 1, pb: 6 }}
      >
        <Typography
          component="h5"
          variant="h5"
          align="left"
          color="text.primary"
          gutterBottom
        >
          BAND INFORMATION
        </Typography>
        <Typography
          component="h6"
          variant="h6"
          align="left"
          color="text.primary"
          gutterBottom
        >
          Email communication
        </Typography>{" "}
        East London Community Band sends regular emails to its members and
        updates about special events or rehearsals – we don’t share your email
        address with other organisations.
        <Typography
          component="h6"
          variant="h6"
          align="left"
          color="text.primary"
          gutterBottom
        >
          Photography and filming{" "}
        </Typography>
        East London Community Band performs regularly in public where we take
        photos and record our performances where possible. We use these for
        promoting the band on social media, our website and in print or to
        support funding applications. We assume that you consent to this use
        unless you make it known to us otherwise.
        <Typography
          component="h6"
          variant="h6"
          align="left"
          color="text.primary"
          gutterBottom
        >
          {" "}
          Safeguarding{" "}
        </Typography>
        East London Community Band has a safeguarding policy in place which all
        our members should be aware of. Please read the policy document which is
        available on the band’s Google Drive. A link to the drive is included in
        the member’s weekly email which you will receive once you join band.
        <Typography
          component="h6"
          variant="h6"
          align="left"
          color="text.primary"
          gutterBottom
        >
          {" "}
          Our contact details
        </Typography>
        info@eastlondoncommunityband.co.uk www.eastlondoncommunityband.co.uk
        <Typography
          component="h6"
          variant="h6"
          align="left"
          color="text.primary"
          gutterBottom
        >
          Our organisation{" "}
        </Typography>
        We are a volunteer-run charity overseen by a small group of Trustees and
        a committee. We rely on membership fees and grant funding to operate. We
        are always looking for members to help in various roles and especially
        in identifying funding opportunities. Please let us know if you can
        help.
        <hr />
        <FormControlLabel
          control={<Checkbox />}
          id={"confirmterms"}
          onClick={handleClick}
          size="large"
          checked={wizardState.termsandconditions}
          name="termsandconditions"
          label="I have read and understand the band information"
        />
        <hr />
        <Grid container direction="row" justifyContent={"space-between"}>
          {" "}
          <Grid xs={5} item>
            <Button onClick={props.previousStep} fullWidth variant="contained">
              Back
            </Button>
          </Grid>
          <Grid xs={5} item>
            <Button
              id={"confirm"}
              disabled={!wizardState.termsandconditions}
              onClick={props.nextStep}
              variant="contained"
              fullWidth
            >
              Next
            </Button>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

function ConfirmBeforeCheckout({
  state,
  wizardState,
  setWizardState,
  instrumentsPlayed,
  ...props
}) {
  console.log('Confirm step')
  console.log(instrumentsPlayed)
  const rows = [];
  const [isLoading, setIsloading] = React.useState(false);
  const GBP = new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  });
  let total = 0;
  for (const product of Object.keys(state.prodCat.products)) {
    const name = state.prodCat.products[product].name;

    let selection = [
      state.prodCat.products[product].name +
      ": " +
      state.prodCat.products[product].options[wizardState[product]].description]

    if (product === 'bands') {
      for (const instrument of instrumentsPlayed) {
        selection.push(<br />)
        selection.push(instrument.Band + ': ' + instrument.Instrument)
      }

    }

    const ratedescription = state.prodCat.ratesApplied;
    const price = GBP.format(
      state.prodCat.products[product].options[wizardState[product]].price
    );
    total +=
      state.prodCat.products[product].options[wizardState[product]].price;
    rows.push({ name, selection, ratedescription, price });
  }
  rows.push({ selection: "Total", price: GBP.format(total) });

  const [isDisabled, setIsDisabled] = React.useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    setIsloading(true);

    const enrolment = {
      bands: wizardState.bands,
      lessons: wizardState.lessons,
      giftAidConsent: wizardState.giftaidconsent ? true : false,
      memberEnrolmentsId: state.userdata["custom:memberid"],
      instrumentsPlayed: instrumentsPlayed
    };
    API.graphql({
      query: createEnrolmentMutation,
      variables: {
        input: enrolment,
      },
    }).then((res) => {
      API.post("enrolmentmanager", "/checkout", {
        headers: {
          Authorization: state.accessToken,
        },
        body: {
          enrolmentId: res.data.createEnrolment.id,
        },
      })
        .then((res) => {
          window.location.replace(res.url);
        })
        .catch((err) => {
          console.log("something up with submit");
          console.log(err);
        });
    });

  };


  return (
    <>
      <Container
        // disableGutters
        maxWidth="sm"
        component="main"
        sx={{ pt: 1, pb: 6 }}
      >
        <Typography marginBottom={4}>
          Please read the below details and confirm your selection for band
          membership this term. If you need to fix anything, use the back
          buttons to update your choices, before continuing to payment.
        </Typography>

        <Container paddingTop={1} marginY={"10pt"}>
          {" "}
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="left">Membership Details</TableCell>
                  <TableCell align="left">Rate</TableCell>
                  <TableCell align="left">Price</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow
                    key={row.name}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell align="left">{row.selection}</TableCell>
                    <TableCell align="left">{row.ratedescription}</TableCell>
                    <TableCell align="left">{row.price}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Container>
        <Grid container direction="row" alignContent={"end"}>
          <Grid xs={6}></Grid>
          <Grid xs={6}>
            <Box>
              <List>
                <ListItem>
                  <ListItemIcon>
                    {" "}
                    {wizardState.giftaidconsent ? <DoneIcon /> : <CancelIcon />}
                  </ListItemIcon>
                  <ListItemText> Gift Aid Consent Given</ListItemText>
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    {wizardState.termsandconditions ? (
                      <DoneIcon />
                    ) : (
                      <CancelIcon />
                    )}
                  </ListItemIcon>
                  <ListItemText>Band Information Read</ListItemText>
                </ListItem>
              </List>
            </Box>
          </Grid>
        </Grid>
        <Grid container direction="row" justifyContent={"space-between"}>
          {" "}
          <Grid xs={5} item>
            <Button onClick={props.previousStep} fullWidth variant="contained">
              Back
            </Button>
          </Grid>
          <Grid xs={5} item>
            <Button
              id={"pay"}
              disabled={
                !wizardState.termsandconditions ||
                (total === 0) & (state.usertype !== "concession")
              }
              onClick={handleSubmit}
              variant="contained"
              fullWidth
            >
              {isLoading ? (
                <>
                  <CircularProgress size={12} /> &nbsp;
                </>
              ) : null}
              Next
            </Button>
          </Grid>
        </Grid>
        {(total === 0) & (state.usertype !== "concession") ? (
          <Typography marginY={2} color="red">
            You need to select either lessons or band membership before
            proceeding. Use the back buttons to select either lessons or a band
            membership.
          </Typography>
        ) : null}
      </Container>
    </>
  );
}
