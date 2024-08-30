import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import omitDeep from "omit-deep";
import { Analytics } from "aws-amplify";
import Loading from "./Loading.jsx";
import Button from "@mui/material/Button";
import Switch from "@mui/material/Switch";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import MusicNote from "@mui/icons-material/MusicNote";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import GlobalStyles from "@mui/material/GlobalStyles";
import Container from "@mui/material/Container";


import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import * as queries from "../graphql/queries";
import { API } from "aws-amplify";
import { useNavigate, Navigate } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import PeopleIcon from "@mui/icons-material/PeopleOutlined";
import Avatar from "@mui/material/Avatar";
import { Formik, ErrorMessage, Field, setIn } from "formik";

import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";

import moment from "moment";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Alert from "@mui/material/Alert";
import * as yup from "yup";
import { FormHelperText } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";

import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl, { formControlClasses } from "@mui/material/FormControl";

import { updateEnrolment as updateEnrolmentMutation } from "../graphql/mutations";
import { updateMember } from "../graphql/mutations";

import withAuth from './withAuth.jsx';

function PricingContent(props) {

  const [isLoaded, setIsLoaded] = React.useState(false);

  const handleClose = () => {
    setError({ error: false });
  };
  const age = (birthdate) => {
    return moment().diff(birthdate, "years");
  };
  const [error, setError] = React.useState({ error: false, message: "" });
  const [state, setState] = React.useState({});


  // React.useEffect(() => {
  //   Analytics.record({ name: "enrolmentManagementVisit" });
  //   API.get("enrolmentmanager", "/enrolmentstatus", {
  //     headers: {
  //       Authorization: session?.idToken?.getJwtToken(),
  //     },
  //   }).then((state) => {
  //     state.accessToken = session?.idToken?.getJwtToken();
  //     setState(state);
  //     setIsLoaded(true);
  //   }).catch(console.log);;
  // }, [session]);

  React.useEffect(() => {

    setIsLoaded(true);
    setState(props);
    console.log('bong')
  }, [props]);




  return isLoaded ? (
    <>

      <Header groups={props.user.groups.map(g => g.name)} />
      <GlobalStyles
        styles={{ ul: { margin: 0, padding: 0, listStyle: "none" } }}
      />
      <CssBaseline />



      <Container maxWidth="sm"
        component="main"
        sx={{ pt: 2, pb: 2, flexGrow: 1, display: 'flex', flexDirection: 'column' }}

      >
        <Grid item xs={12} sm={10} elevation={6} >
          <Box
            sx={{
              my: 8,
              mx: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >

            <PersonalDetails

              member={state.member}
              setError={setError}
            />

            {age(state.member?.dateOfBirth) < 30 ? (
              <ManageSiblings user={state.member} setError={setError} />
            ) : null}
            {state.currentEnrolment &&
              state.currentEnrolment?.bands !== "none" ? (
              <MyBands state={state} />
            ) : null}

          </Box>
        </Grid>
        <Snackbar
          open={error.error}
          autoHideDuration={6000}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          onClose={() => {
            // handleClose();
            // props.re(initialValues);
          }}
        >
          <Alert
            onClose={() => {
              handleClose();
            }}
            severity="error"
            sx={{ width: "100%" }}
          >
            Update failed ({error.message})
          </Alert>
        </Snackbar>

      </Container >

      <Footer />
    </>
  ) : (
    <Loading />
  );
}

function MyBands({ state }) {
  console.log('In my bands')
  console.log(state)
  const [instrumentsPlayed, setInstrumentsPlayed] = React.useState([]);

  React.useEffect(() => {
    setInstrumentsPlayed(
      //JSON.parse(JSON.stringify(state.currentEnrolment?.instrumentsPlayed))
      []
    );
    console.log('done')
  }, [state.currentEnrolment]);

  const handleChange = (event) => {
    const selectedBand = event.target.name;
    const selectedInstrument = event.target.value;

    const newInstruments = [];
    let found = false;
    for (const instrument of instrumentsPlayed || []) {
      if (instrument.Band === selectedBand) {
        found = true;
        if (selectedInstrument !== "Not Attending") {
          newInstruments.push({
            Band: selectedBand,
            Instrument: selectedInstrument,
          });
        }
      } else {
        newInstruments.push(instrument);
      }
    }
    if (!found) {
      newInstruments.push({
        Band: selectedBand,
        Instrument: selectedInstrument,
      });
    }

    API.graphql({
      query: updateEnrolmentMutation,
      variables: {
        input: {
          id: state.currentEnrolment.id,
          instrumentsPlayed: newInstruments,
        },
      },
    }).then((res) => {
      setInstrumentsPlayed(
        omitDeep(res.data.updateEnrolment.instrumentsPlayed, ["__typename"])
      );
      // setInstrumentsPlayed(res.data.updateEnrolment.instrumentsPlayed);
    });
  };
  return (
    <Accordion
      sx={{
        width: "100%",
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <MusicNote />
          </Avatar>
          <Typography alignItems={"center"}>My Bands</Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Box component="form" sx={{ mt: 1 }}>
          <Grid spacing={2} container>
            <Grid item xs={12}>
              <Typography>
                To help us run things smoothly, for each band you are attending
                this term, please specify which instrument you are playing.
              </Typography>

              {state.prodCat.products.bands.options[
                state.currentEnrolment.bands
              ]?.features.options.map((band) => {

                return (
                  <FormControl key={band} sx={{ mt: 3, mb: 1 }} fullWidth>
                    <InputLabel id="instruments">{band.description}</InputLabel>

                    <Select
                      label={band.description}
                      component="Select"
                      name={band.description}
                      fullWidth
                      id={band.description}
                      value={
                        instrumentsPlayed?.filter(
                          (instrument) => instrument.Band === band.description
                        )[0]?.Instrument || "Not Attending"
                      }
                      // You need to set the new field value
                      onChange={handleChange}
                      multiple={false}
                    >
                      {band.instruments.map((s) => (
                        <MenuItem fullWidth key={s} value={s}>
                          {s}
                        </MenuItem>
                      ))}
                      <MenuItem
                        fullWidth
                        key={"Not Attending"}
                        value={"Not Attending"}
                      >
                        {"Not Attending"}
                      </MenuItem>
                    </Select>
                  </FormControl>
                );
              })}
            </Grid>
          </Grid>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}

function PersonalDetails({ member }) {

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const navigate = useNavigate();

  const minDate = new Date(
    new Date(new Date().setFullYear(new Date().getFullYear() - 100)).setDate(1)
  );
  const ethnicGroups = [
    "Prefer Not Say",
    "Indian",
    "Pakistani",
    "Bangladeshi",
    "Chinese",
    "Any other Asian background",
    "Caribbean",
    "African",
    "Any other Black, Black British, or Caribbean background",
    "White and Black Caribbean",
    "White and Black African",
    "White and Asian",
    "White - English, Welsh, Scottish, Northern Irish or British",
    "White - Irish",
    "White - Gypsy or Irish Traveller",
    "White - Roma",
    "Any other White background",
    "Arab",
    "Any other ethnic group",
  ];
  const handleSaveProfile = (values) => {

    setIsSubmitting(true);
    const updated = {
      ...values,
      //dateOfBirth: moment(values.dateOfBirth).format("MM/DD/YYYY"),
      id: member.id,
    };


    // Auth.updateUserAttributes(user, updated)
    //   .then((user) => {
    //     setIsSubmitting(false);
    //     navigate(0);
    //   })
    //   .catch((error) => {
    //     setError({ error: true, message: error.message });
    //     setIsSubmitting(false);
    //   });
    API.graphql({
      query: updateMember,
      variables: {
        input: updated,
      },
    }).then((member) => {
      setIsSubmitting(false);
      navigate(0);
    });
  };

  const initialValues = {
    forename: member?.forename || "",
    surname: member?.surname || "",
    dateOfBirth: member?.dateOfBirth || "",
    gender: member?.gender || "",
    siblings: member?.siblings || null,
    ethnicity: member?.ethnicity || "",
  };

  const ethnicity = React.createRef();
  const dob = React.createRef();
  const [dimensions, setDimensions] = React.useState({
    height: window.innerHeight,
    width: window.innerWidth,
  });

  const handleResize = () => {
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  React.useEffect(() => {

    ethnicity.current.style.width = 0;

    ethnicity.current.style.width = dob.current.offsetWidth + "px";
  }, [dimensions]);

  React.useEffect(() => {
    window.addEventListener("resize", handleResize, false);
  }, []);
  return (
    <Formik
      enableReinitialize
      validationSchema={yup.object().shape({
        username: yup
          .string()
          .required("Required")
          .matches(
            /[a-zA-Z0-9]/,
            "Username can only contain non-special letters and numbers."
          ),
        password: yup
          .string()
          .required("No password provided.")
          .min(8, "Password is too short - should be 8 chars minimum.")
          .matches(
            /[a-zA-Z0-9]/,
            "Password can only contain non-special letters and numbers."
          ),
        confirmpassword: yup
          .string()
          .required("You must confirm your password")
          .oneOf([yup.ref("password"), null], "Passwords must match"),
        email: yup
          .string()
          .required("Please provide contact Email")
          .email("Not a valid email"),
        forename: yup.string().required("Required"),
        surname: yup.string().required("Required"),
        ethnicity: yup
          .string()
          .required(
            "Please advise ethnic group for inclusion monitoring purposes"
          ),
        sex: yup.string().required(),
        dateOfBirth: yup
          .date()
          .max(new Date(), "Date must be in the past")
          .min(minDate, "Check the year....")
          .required("Required")
          .typeError(
            "Invalid Date - Expecting date in the format DD/MM/YYYY e.g. 31/08/2002"
          ),
      })}
      initialValues={initialValues}
    >
      {({
        handleSubmit,
        values,
        touched,
        isValid,
        errors,
        handleChange,
        handleBlur,
        setFieldValue,
        setFieldTouched,
        resetForm,
      }) => (
        <Accordion
          sx={{
            width: "100%",
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                <AccountCircleOutlinedIcon />
              </Avatar>
              <Typography alignItems={"center"}>Personal Details</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <Grid spacing={2} container>
                <Grid item xs={12} sm={6}>
                  <TextField
                    onChange={(event) => {
                      handleChange(event);
                      setFieldTouched("forename", true, false);
                    }}
                    onBlur={handleBlur}
                    name="forename"
                    label="Forename"
                    value={values.forename.capitalize()}
                    autoComplete="off"
                    fullWidth
                    error={errors.forename && touched.forename}
                    type="text"
                    helperText={<ErrorMessage name="name" />}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    onChange={(event) => {
                      handleChange(event);
                      setFieldTouched("surname", true, false);
                    }}
                    onBlur={handleBlur}
                    name="surname"
                    label="Surname"
                    value={values.surname.capitalize()}
                    autoComplete="off"
                    fullWidth
                    error={errors.surname && touched.surname}
                    type="text"
                    helperText={<ErrorMessage name="surname" />}
                  />
                </Grid>
                <Grid item xs={12}>
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DatePicker
                      ref={dob}
                      onChange={(value) => {
                        setFieldValue("dateOfBirth", value, true);
                        setFieldTouched("dateOfBirth", true, false);
                      }}
                      inputFormat="DD/MM/yyyy"
                      autocomplete="off"
                      label="Date Of Birth"
                      value={values.dateOfBirth || null}
                      fullWidth
                      renderInput={(params) => (
                        <TextField
                          onBlur={(value) => {
                            setFieldTouched("dateOfBirth", true, false);
                          }}
                          fullWidth
                          name="dateOfBirth"
                          error={errors.dateOfBirth && touched.dateOfBirth}
                          {...params}
                        />
                      )}
                    />
                  </LocalizationProvider>
                  <FormHelperText error={true}>
                    <ErrorMessage name="birthdate" />
                  </FormHelperText>
                </Grid>

                <Grid item xs={12} align="center">
                  <ToggleButtonGroup
                    size={"small"}
                    fullWidth
                    name="gender"
                    color="primary"
                    value={values.gender}
                    exclusive
                    onChange={(event, sex) => {
                      setFieldValue("gender", sex);
                      setFieldTouched("dateOfBirth", true, false);
                    }}
                  >
                    <ToggleButton value="MALE">Male</ToggleButton>
                    <ToggleButton value="FEMALE">Female</ToggleButton>
                    <ToggleButton value="OTHER">Other</ToggleButton>

                    <ToggleButton value="PREFERNOTSAY">
                      Prefer not say
                    </ToggleButton>
                  </ToggleButtonGroup>
                  <FormHelperText error={true}>
                    <ErrorMessage name="gender" />
                  </FormHelperText>
                </Grid>

                <Grid
                  item
                  xs={12}
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <FormControl
                    style={{
                      whiteSpace: "unset",
                      wordBreak: "break-all",
                    }}
                  >
                    <InputLabel
                      id="ethnicitylabel"
                      style={{
                        whiteSpace: "unset",
                        wordBreak: "break-all",
                        width: "300px",
                      }}
                    >
                      Which ethnic group do you belong to?
                    </InputLabel>

                    <Select
                      ref={ethnicity}
                      component="TextAreaAutoSize"
                      style={{
                        whiteSpace: "unset",
                        wordBreak: "break-all",
                        width: "250px",
                      }}
                      labelId="ethnicitylabel"
                      label="Which ethnic group do you belong to?"
                      name="ethnicity"
                      value={values.ethnicity}
                      // You need to set the new field value

                      onChange={(event) => {
                        handleChange(event);
                        setFieldTouched("ethnicity", true, false);
                      }}
                      onBlur={handleBlur("ethnicity")}
                      multiple={false}
                    >
                      {ethnicGroups.map((s) => (
                        <MenuItem
                          style={{
                            whiteSpace: "unset",
                            wordBreak: "break-word",
                          }}
                          key={s}
                          value={s}
                        >
                          {s}
                        </MenuItem>
                      ))}
                    </Select>

                    <FormHelperText error={true}>
                      <ErrorMessage name={"ethnicity"} />
                    </FormHelperText>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  {" "}
                  <Button
                    color={"primary"}
                    fullWidth
                    onClick={() => {
                      handleSaveProfile(values);
                    }}
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    disabled={
                      errors.code ||
                      (Object.keys(touched).length === 0 &&
                        touched.constructor === Object)
                    }
                  >
                    {isSubmitting ? (
                      <CircularProgress
                        size={20}
                        color="secondary"
                        sx={{ marginX: "20px" }}
                      />
                    ) : null}
                    Save
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </AccordionDetails>
        </Accordion>
      )}
    </Formik>
  );
}

function ManageSiblings({ setError, user }) {
  const [checked, setChecked] = React.useState(false);
  const toggleSiblings = () => {
    API.graphql({
      query: updateMember,
      variables: {
        input: { id: user.id, siblings: user.siblings ? false : true },
      },
    })
      .then
      //(resp) => alert(JSON.stringify(resp))
      ()
      .catch((error) => {
        setError({ error: true, message: error.message });
      });
  };
  //

  React.useEffect(() => {
    setChecked(user.siblings);
  }, [user]);

  return (
    <Accordion
      sx={{
        width: "100%",
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <PeopleIcon />
          </Avatar>
          <Typography alignItems={"center"}>Sibling Check</Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Box
          component="form"
          //onSubmit={handleSubmit}
          sx={{ mt: 1 }}
        >
          <Grid spacing={2} container>
            <Grid item xs={12}>
              <FormControlLabel
                id={"siblingcheck"}
                onChange={() => {
                  setChecked(!checked);
                  toggleSiblings();
                }}
                control={
                  <Switch
                    checked={checked}
                    inputProps={{
                      "aria-label": "controlled",
                    }}
                  />
                }
                label="I have at least one sibling under age 30 who is in the band"
              />
            </Grid>
          </Grid>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}


export default withAuth(PricingContent)