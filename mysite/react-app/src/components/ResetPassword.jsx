import React, { useState, useEffect, useLayoutEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";

import { Analytics } from "aws-amplify";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl, { formControlClasses } from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import FormControlLabel from "@mui/material/FormControlLabel";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";
import Toolbar from "@mui/material/Toolbar";
import Link from "@mui/material/Link";
import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Formik, ErrorMessage, Field } from "formik";
import { Auth, Hub } from "aws-amplify";
import * as yup from "yup";
import { FormHelperText, TextareaAutosize } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import moment from "moment";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import StepWizard from "react-step-wizard";

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

export default function ResetPassword() {
  Analytics.record({ name: "resetPasswordVisit" });
  const [error, setError] = useState({ error: false, message: "" });
  const [formObject, setFormObject] = useState({});

  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const initialValues = {
    username: "",
    password: "",
    confirmpassword: "",
    code: "",
  };

  const handleClose = () => {
    setError({ error: false });
    //setFormObject({ username: "", password: "" });
  };
  // if logged in redirect to real page
  Auth.currentAuthenticatedUser()
    .then((user) => {
      navigate("/landing");
    })
    .catch(console.log);

  const flashError = (error) => {
    setError({ error: true, message: error.message });
  };

  const fontLoaded = document.fonts.load("12px 'Josefin Sans'");

  const [isLoaded, setIsLoaded] = useState(false);

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
              "url(https://pbs.twimg.com/media/EPZQDu7W4AEA9nq?format=jpg&name=large)",
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
              )
              .matches(/^(\S+$)/g, "Username does not contain spaces"),
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
            code: yup
              .string()
              .min(6, "Code should be 6 digits.")
              .max(6, "Code should be 6 digits.")
              .matches(/^\d+$/, "Code should be 6 digits.")
              .required("Please provide Verification Code"),
          })}
          initialValues={initialValues}
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
                    src="/elcblogo.png"
                  />
                  <Typography component="h1" variant="h5">
                    Reset Password
                  </Typography>
                  <Box
                    component="form"
                    onSubmit={props.handleSubmit}
                    sx={{ mt: 1 }}
                  >
                    <StepWizard>
                      <Step1 {...props} flashError={flashError} />
                      <Step2
                        {...props}
                        //errors={{ code: false }}
                        flashError={flashError}
                      />
                      <Step3 {...props} flashError={flashError} />
                    </StepWizard>
                  </Box>
                  <Grid item>
                    <Link href="/" variant="body2">
                      {"Remembered your password? Sign in here"}
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
                  {error.message}
                </Alert>
              </Snackbar>
            </>
          )}
        </Formik>
      </Grid>
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
  setTouched,
  isValid,
  flashError,
  ...props
}) {
  function handleForgotPassword() {
    setTouched({});
    Auth.forgotPassword(values.username)
      .then(() => {
        props.nextStep();
      })
      .catch(() =>
        flashError({
          message:
            "Unable to reset password.   Check that you got the username absolutely right.",
        })
      );
  }
  return (
    <>
      <Grid spacing={2} container>
        <Grid item xs={12}>
          <Typography component="p" variant="body" color="green">
            Please enter your username, so that we can send you a recovery code
            to your registered email.
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <TextField
            onChange={handleChange}
            onBlur={handleBlur}
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
      </Grid>
      <Button
        onClick={handleForgotPassword}
        id={"next"}
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={
          errors.username ||
          (Object.keys(touched).length === 0 && touched.constructor === Object)
            ? true
            : false
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
  setErrors,
  ...props
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  console.log(props);
  function handleResetPassword() {
    Auth.forgotPasswordSubmit(values.username, values.code, values.password)
      .then(() => {
        //
        //  redirect to sign in page
        //
        props.nextStep();
      })
      .catch(flashError);
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
            onBlur={handleBlur}
            name="code"
            label="Verification Code (from your email)"
            id={"verification-code"}
            value={values.code}
            autoComplete="off"
            fullWidth
            error={errors.code && touched.code}
            type="text"
            helperText={<ErrorMessage name="code" />}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            onChange={handleChange}
            onBlur={handleBlur}
            name="password"
            id={"new-password"}
            label="New Password"
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
            onBlur={handleBlur}
            name="confirmpassword"
            label="Confirm New Password"
            value={values.confirmpassword}
            id={"verify-password"}
            autoComplete="off"
            fullWidth
            error={errors.confirmpassword && touched.confirmpassword}
            type="password"
            helperText={<ErrorMessage name="confirmpassword" />}
          />
        </Grid>
      </Grid>
      <Button
        onClick={handleResetPassword}
        fullWidth
        id={"next"}
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={
          errors.code ||
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
    navigate("/signin");
  }

  return (
    <>
      <Grid spacing={2} container>
        <Grid item xs={12}>
          <Typography component="p" variant="body" color="green">
            We have now reset your password. Click Sign In to return to the Sign
            In page and log in as normal.
          </Typography>
        </Grid>
      </Grid>
      <Button
        fullWidth
        onClick={handleConfirmCode}
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
      >
        Sign In
      </Button>
    </>
  );
}
