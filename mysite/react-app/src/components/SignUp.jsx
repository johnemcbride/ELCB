import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Toolbar from "@mui/material/Toolbar";
import Link from "@mui/material/Link";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { Formik, ErrorMessage } from "formik";

import * as yup from "yup";
import { FormHelperText } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import moment from "moment";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import StepWizard from "react-step-wizard";
import { router } from '@inertiajs/react'

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

String.prototype.capitalize = function (lower) {
  return (lower ? this.toLowerCase() : this).replace(
    /(?:^|\s|['`‘’.-])[^\x00-\x60^\x7B-\xDF](?!(\s|$))/g,
    function (a) {
      return a.toUpperCase();
    }
  );
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
      <Link color="inherit" href="https://www.eastlondoncommunityband.co.uk">
        East London Community Band
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

export default function SignUpSide(props) {

  console.log('Prop test')
  console.log(props)
  Analytics.record({ name: "signUpVisit" });
  const [error, setError] = useState({ error: false, message: "" });
  const [formObject, setFormObject] = useState({});

  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const initialValues = {
    forename: formObject.forename || "",
    surname: formObject.surname || "",
    dateofbirth:
      formObject.dateofbirth != null
        ? moment(formObject.dateofbirth, "YYYY-MM-DD")
        : null,
    ethnicity: formObject.ethnicity || "",
    sex: "",
    username: "",
    email: "",
    password: "",
    confirmpassword: "",
    code: "",
  };

  const handleClose = () => {
    setError({ error: false });
    //setFormObject({ username: "", password: "" });
  };


  const minDate = new Date(
    new Date(new Date().setFullYear(new Date().getFullYear() - 100)).setDate(1)
  );

  const flashError = (error) => {
    setError({ error: true, message: error.message });
  };



  const wagtailProps = props
  console.log('JOHN DEBUG')
  console.log(wagtailProps)
  return (
    <>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage:
              "url(https://pbs.twimg.com/media/E_31ryNVIAg0kxw?format=jpg&name=large)",
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}

        />

        <Formik
          //enableReinitialize
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
            ethnicgroup: yup
              .string()
              .required(
                "Please advise ethnic group for inclusion monitoring purposes"
              ),
            dateofbirth: yup
              .date()
              .max(new Date(), "Date must be in the past")
              .min(minDate, "Check the year....")
              .required("Required")
              .typeError(
                "Invalid Date - Expecting date in the format DD/MM/YYYY e.g. 31/08/2002"
              ),
          })}
          initialValues={initialValues}
          onSubmit={(values) => {
            setFormObject({
              ...formObject,
              ...values,
            });

          }}
        >
          {(props) => (
            <>
              <Grid
                item
                xs={12}
                sm={8}
                md={5}
                component={Paper}
                elevation={6}
                square
              >
                <AppBar
                  position="static"
                  color="default"
                  elevation={0}
                  sx={{
                    borderBottom: (theme) =>
                      `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Toolbar sx={{ flexWrap: "wrap" }}>
                    <Typography
                      variant="h6"
                      color="inherit"
                      sx={{ flexGrow: 1 }}
                    >
                      East London Community Band
                    </Typography>
                  </Toolbar>
                </AppBar>
                <Box
                  sx={{
                    my: 2,
                    mx: 2,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Box
                    component="img"
                    sx={{
                      height: 73,
                      width: 80,
                      my: 1,
                    }}
                    src="/static/elcblogo.png"
                  />
                  <Typography component="h1" variant="h5"
                    dangerouslySetInnerHTML={{ __html: wagtailProps.welcome_message }}
                  >

                  </Typography>
                  <Box
                    component="form"
                    onSubmit={props.handleSubmit}
                    sx={{ mt: 1 }}
                  >
                    <StepWizard>
                      <Step1 {...props} {...wagtailProps} />
                      <Step2 {...props} {...wagtailProps} flashError={flashError} />
                      <Step3 {...props}  {...wagtailProps} flashError={flashError} />
                    </StepWizard>
                  </Box>
                  <Grid item>
                    <Link href="/" variant="body2">
                      {"Already have an account? Sign in here"}
                    </Link>
                  </Grid>
                  <Copyright sx={{ mt: 5 }} />
                </Box>
              </Grid>
              <Snackbar
                open={error.error}
                autoHideDuration={6000}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                onClose={() => {
                  handleClose();
                }}
              >
                <Alert
                  onClose={() => {
                    handleClose();
                  }}
                  severity="error"
                  sx={{ width: "100%" }}
                >
                  SignUp failed ({error.message})
                </Alert>
              </Snackbar>
            </>
          )}
        </Formik>
      </Grid >
    </>
  );
}

function Step1({
  handleBlur,
  handleChange,
  values,
  touched,
  errors,
  setFieldValue,
  setFieldTouched,
  isValid,
  ...props
}) {
  const ethnicity = React.createRef();
  const dob = React.createRef();
  const [dimensions, setDimensions] = React.useState({
    height: window.innerHeight,
    width: window.innerWidth,
  });
  const [disabled, setDisabled] = React.useState(true);
  const handleResize = () => {
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  useEffect(() => {
    console.log("Step 1");
    ethnicity.current.style.width = 0;
    console.log(dob.current.offsetWidth);
    ethnicity.current.style.width = dob.current.offsetWidth + "px";
  }, [dimensions]);

  useEffect(() => {
    window.addEventListener("resize", handleResize, false);
  }, []);

  return (
    <>
      <Grid spacing={2} container>
        <Grid item xs={12} sm={6}>
          <TextField
            onChange={handleChange}
            id={"forename"}
            onBlur={handleBlur}
            name="forename"
            label="First name"
            value={values.forename.capitalize()}
            autoComplete="off"
            fullWidth
            error={errors.forename && touched.forename}
            type="text"
            helperText={<ErrorMessage name="forename" />}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            onChange={handleChange}
            id={"surname"}
            onBlur={handleBlur}
            name="surname"
            label="Family name"
            value={values.surname.capitalize()}
            autoComplete="off"
            fullWidth
            error={errors.surname && touched.surname}
            type="text"
            helperText={<ErrorMessage name="surname" />}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography component="p" variant="body" color="green">
            Data to support our funding applications:
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <DatePicker
              ref={dob}
              onChange={(value) => {
                setFieldValue("dateofbirth", value, true);
                setFieldTouched("dateofbirth", true, false);
              }}
              inputFormat="DD/MM/yyyy"
              autocomplete="off"
              label="Date of birth"
              value={values.dateofbirth || null}
              fullWidth
              renderInput={(params) => (
                <TextField
                  id={"dateofbirth"}
                  onBlur={(value) => {
                    setFieldTouched("dateofbirth", true, false);
                  }}
                  fullWidth
                  name="dateofbirth"
                  error={errors.dateofbirth && touched.dateofbirth}
                  {...params}
                />
              )}
            />
          </LocalizationProvider>
          <FormHelperText error={true}>
            <ErrorMessage name="dateofbirth" />
          </FormHelperText>
        </Grid>

        <Grid item xs={12} align="center">
          <ToggleButtonGroup
            id={"gender"}
            fullWidth
            size={"small"}
            name="sex"
            color="primary"
            value={values.sex}
            exclusive
            onChange={(event, sex) => {
              setFieldValue("sex", sex);
            }}
          >
            <ToggleButton id="toggle-male" value="male">
              Male
            </ToggleButton>
            <ToggleButton value="female">Female</ToggleButton>
            <ToggleButton value="other">Other</ToggleButton>
            <ToggleButton value="prefernotsay">Prefer not to say</ToggleButton>
          </ToggleButtonGroup>
          <FormHelperText error={true}>
            <ErrorMessage name="sex" />
          </FormHelperText>
        </Grid>

        <Grid
          item
          xs={12}
          sx={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <FormControl
            style={{
              whiteSpace: "unset",
              wordBreak: "break-all",
            }}
            fullWidth
          >
            <InputLabel id="ethnicitylabel">
              Which ethnic group do you belong to?
            </InputLabel>

            <Select
              ref={ethnicity}
              id={"ethnicity"}
              style={{
                whiteSpace: "unset",
                wordBreak: "break-all",
                width: "100%",
                maxWidth: "100%",
              }}
              labelId="ethnicitylabel"
              label="Which ethnic group do you belong to?"
              name="ethnicity"
              value={values.ethnicity}
              // You need to set the new field value
              onChange={(e) => {
                setFieldValue("ethnicity", e.target.value);
                setDisabled(false);
                console.log("changed");
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

            <FormHelperText error={true} type="invalid">
              <ErrorMessage name={"ethnicity"} />
            </FormHelperText>
          </FormControl>
        </Grid>
      </Grid>
      <Button
        onClick={props.nextStep}
        fullWidth
        id={"next"}
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={
          disabled ||
          (errors.forename ||
            errors.surname ||
            errors.dateofbirth ||
            errors.sex ||
            (Object.keys(touched).length === 0 && touched.constructor === Object)
            ? true
            : false)
        }
      >
        Next
      </Button>
      <Grid
        container
        sx={{
          my: 1,
          mx: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
        justifyContent="flex-end"
      ></Grid>
    </>
  );
}

function Step2({
  handleBlur,
  handleChange,
  values,
  touched,
  errors,
  setFieldValue,
  setFieldTouched,
  flashError,
  ...props
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleRegisterUser() {
    // Auth.signUp({
    //   username: values.username.trim(),
    //   password: values.password.trim(),
    //   attributes: {
    //     email: values.email,
    //     gender: values.sex,
    //     birthdate: values.dateofbirth.format("MM/DD/yyyy"),
    //     name: values.forename,
    //     family_name: values.surname,
    //     "custom:ethnicity": values.ethnicity,
    //   },
    //   autoSignIn: {
    //     // optional - enables auto sign in after user is confirmed
    //     enabled: true,
    //   },
    // })
    //   .then(() => {
    //     props.nextStep();
    //   })
    //   .catch(flashError);

    fetch("/frontend/signup/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'X-CSRFToken': props.csrf_token
      },
      body: JSON.stringify({
        username: values.username.trim(),
        password: values.password.trim(),
        email: values.email,
        gender: values.sex,
        birthdate: values.dateofbirth.format("MM/DD/yyyy"),
        name: values.forename,
        family_name: values.surname,
        ethnicity: values.ethnicity,
      }),
    })
      .then((response) => {
        console.log('What I get back from register');
        console.log(response);

        // Check if the response is OK (status code 2xx)
        if (!response.ok) {
          // Attempt to parse the JSON error message from the response
          return response.json().then((data) => {
            flashError({ error: true, message: data.detail || 'Login failed' });
            throw new Error(data.detail || 'Signup failed'); // Rethrow the error to break out of the chain
          });
        } else {
          return response.json(); // Parse the JSON response
        }
      })
      .then((data) => {
        // Assuming a successful login, redirect the user
        router.visit('/landing');
        setIsSubmitting(false);
      })
      .catch((error) => {
        console.error("Something went wrong with the submit:");
        console.error(error);
        setIsSubmitting(false);
      });


  }
  return (
    <>
      <Grid spacing={2} container>
        <Grid item xs={12}>
          <TextField
            onChange={handleChange}
            onBlur={handleBlur}
            id={"username"}
            name="username"
            label="Username"
            value={values.username}
            autoComplete="off"
            fullWidth
            error={errors.username && touched.username}
            type="text"
            helperText={<ErrorMessage name="username" />}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            onChange={handleChange}
            onBlur={handleBlur}
            id={"email"}
            name="email"
            label="Email"
            value={values.email}
            autoComplete="off"
            fullWidth
            error={errors.email && touched.email}
            type="email"
            helperText={<ErrorMessage name="email" />}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            onChange={handleChange}
            id={"password"}
            onBlur={handleBlur}
            name="password"
            label="Password"
            value={values.password}
            autoComplete="off"
            fullWidth
            error={errors.password && touched.password}
            type="password"
            helperText={<ErrorMessage name="password" />}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            onChange={handleChange}
            id={"confirmpassword"}
            onBlur={handleBlur}
            name="confirmpassword"
            label="Confirm Password"
            value={values.confirmpassword}
            autoComplete="off"
            fullWidth
            error={errors.confirmpassword && touched.confirmpassword}
            type="password"
            helperText={<ErrorMessage name="confirmpassword" />}
          />
        </Grid>
      </Grid>
      <Button
        onClick={handleRegisterUser}
        fullWidth
        id={"register"}
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={
          errors.username ||
            errors.email ||
            errors.password ||
            errors.confirmpassword ||
            (Object.keys(touched).length === 0 && touched.constructor === Object)
            ? true
            : false
        }
      >
        Next
      </Button>
    </>
  );
}

function Step3({
  handleBlur,
  handleChange,
  values,
  touched,
  errors,
  setFieldValue,
  setFieldTouched,
  flashError,
  ...props
}) {
  const navigate = useNavigate();
  function handleConfirmCode() {
    // Auth.confirmSignUp(values.username, values.code)
    //   .then(() => {
    //     console.log(
    //       "SIgn up confirmed, Hub listenign for event before navigating on"
    //     );
    //   })
    //   .catch((error) => {
    //     console.log("grrrrr");
    //     flashError(error);
    //   });

    //Bypassing
    router.visit('/landing')
  }

  function handleResendCode() {
    // Auth.resendSignUp(values.username).catch((error) => {
    //   console.log("grrrrr");
    //   flashError(error);
    // });
    flashError('TODO: implement code thing')
  }
  return (
    <>
      <Grid spacing={2} container>
        <Grid item xs={12}>
          <Typography component="p" variant="body" color="green">
            We sent a code to your email to make sure it's you. Copy it here. No
            code? Check junk.
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <TextField
            onChange={handleChange}
            id={"verificationcode"}
            onBlur={handleBlur}
            margin="normal"
            name="code"
            label="Verification code"
            value={values.code}
            autoComplete="off"
            fullWidth
            error={errors.code && touched.code}
            type="text"
            helperText={<ErrorMessage name="code" />}
          />
        </Grid>
      </Grid>
      <Button
        fullWidth
        onClick={handleConfirmCode}
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={
          errors.code ||
            (Object.keys(touched).length === 0 && touched.constructor === Object)
            ? true
            : false
        }
      >
        Sign Up
      </Button>
      <Button
        fullWidth
        onClick={handleResendCode}
        variant="outlined"
        sx={{ mt: 3, mb: 2 }}
        disabled={
          errors.code ||
          (Object.keys(touched).length === 0 && touched.constructor === Object)
        }
      >
        Still no code? Resend Verification Code
      </Button>
    </>
  );
}
