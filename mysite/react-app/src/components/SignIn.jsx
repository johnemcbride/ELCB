import React, { useState, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";

import { Analytics } from "aws-amplify";
import Link from "@mui/material/Link";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";
import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { Formik, ErrorMessage, Field } from "formik";
import { Auth } from "aws-amplify";
import * as yup from "yup";
import CircularProgress from "@mui/material/CircularProgress";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

import Loading from "./Loading.jsx";
import GlobalStyles from "@mui/material/GlobalStyles";

function Copyright(props) {
  return (
    <Grid item>
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
    </Grid>
  );
}

export default function SignIn() {
  const [error, setError] = useState({ error: false, message: "" });
  const [formObject, setFormObject] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();

  const initialValues = {
    username: formObject.username || "",
    password: formObject.password || "",
  };

  const handleClose = () => {
    setError({ error: false });
    setFormObject({ username: "", password: "" });
  };

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    Analytics.record({ name: "signInVisit" });
    console.log("is loaded is" + isLoaded);
    console.log("sign in page moutning");

    const notloggedin = Auth.currentAuthenticatedUser();
    const fontLoaded = document.fonts.load("12px 'Josefin Sans'");

    Promise.allSettled([notloggedin, fontLoaded]).then((results) => {
      console.log(JSON.stringify(results));
      if (results[0].status === "fulfilled") {
        navigate("/landing");
      } else {
        console.log(document.fonts.load("12px 'Josefin Sans'"));
        setIsLoaded(true);
      }
    });
  }, []);

  return isLoaded ? (
    <>
      <GlobalStyles
        styles={{ ul: { margin: 0, padding: 0, listStyle: "none" } }}
      />

      <Grid container component="main" sx={{ height: "100vh" }}>
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage:
              "url(https://pbs.twimg.com/media/FBv9fhvXEGAfrKL?format=jpg&name=large)",
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
          enableReinitialize
          validationSchema={yup.object().shape({
            username: yup.string(),
            password: yup.string().required("Required"),
          })}
          initialValues={initialValues}
          onSubmit={(values) => {
            setIsSubmitting(true);
            setFormObject({
              ...formObject,
              ...values,
            });
            try {
              Auth.signIn(values.username.trim(), values.password.trim())
                .then((user) => {
                  navigate("/landing");
                  setIsSubmitting(false);
                })
                .catch((error) => {
                  setError({ error: true, message: error.message });
                  setIsSubmitting(false);
                  console.log("error signing in", error);
                });
            } catch (error) { }
          }}
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
            <>
              <Grid
                item
                xs={12}
                sm={8}
                md={5}
                component={Paper}
                elevation={0}
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
                    justifyContent: "space-between",
                  }}
                >
                  <Typography component="h1" variant="h5">
                    Welcome to band!
                  </Typography>
                  <Box
                    component="img"
                    sx={{
                      height: 73,
                      width: 80,
                      my: 1,
                    }}
                    alt="Logo"
                    src="/static/frontend/elcblogo.png"
                  />
                  <Typography component="h1" variant="h5">
                    Sign in
                  </Typography>
                  <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                    <TextField
                      onChange={handleChange}
                      onBlur={handleBlur}
                      id={"Username"}
                      name="username"
                      label="Username"
                      value={values.username}
                      autoComplete="off"
                      fullWidth
                      error={errors.username && touched.username}
                      type="text"
                      helperText={<ErrorMessage name="username" />}
                    />

                    <TextField
                      onChange={handleChange}
                      onBlur={handleBlur}
                      margin="normal"
                      id={"Password"}
                      name="password"
                      label="Password"
                      value={values.password}
                      autoComplete="off"
                      fullWidth
                      error={errors.password && touched.password}
                      type="password"
                      helperText={<ErrorMessage name="password" />}
                    />

                    <Button
                      type="submit"
                      id={"Signin"}
                      fullWidth
                      variant="contained"
                      sx={{ mt: 3, mb: 2 }}
                      disabled={
                        !isValid ||
                        (Object.keys(touched).length === 0 &&
                          touched.constructor === Object) ||
                        isSubmitting
                      }
                    >
                      {isSubmitting ? (
                        <CircularProgress
                          size={20}
                          color="secondary"
                          sx={{ marginX: "20px" }}
                        />
                      ) : null}
                      Sign In
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
                    ></Grid>
                  </Box>
                  <Grid item>
                    <Link
                      id={"sign-up-link"}
                      align={"center"}
                      href="/signup"
                      variant="body2"
                    >
                      {"Don't have an account yet? Sign up here"}
                    </Link>
                  </Grid>
                  <Grid item>
                    <Link
                      id={"change-password-link"}
                      align={"center"}
                      href="/resetpassword"
                      variant="body2"
                    >
                      {"Don't remember your password? Change it here"}
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
                  Login failed ({error.message})
                </Alert>
              </Snackbar>
            </>
          )}
        </Formik>
      </Grid>
    </>
  ) : (
    <Loading />
  );
}
