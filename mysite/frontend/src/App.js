import React from "react";
import Terms from "./components/Terms";
import ResetPassword from "./components/ResetPassword";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import "@fontsource/josefin-sans";
import { Amplify, API } from "aws-amplify";
import NewMemberLanding from "./components/NewMemberLanding";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Header from "./components/Header";
import Footer from "./components/Footer";
import SignOut from "./components/SignOut";
import NewMemberProfile from "./components/NewMemberProfile";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import * as queries from "./graphql/queries";
import { orange } from "@mui/material/colors";
import Enrolments from "./pages/admin/Enrolments"
import Members from "./pages/admin/Members"
import Holidays from "./pages/admin/Holidays"
import { Auth } from "aws-amplify";
import awsconfig from "./aws-exports";
import { PrivateRoute } from "./components/PrivateRoute";
import Loading from "./components/Loading";
import Box from '@mui/material/Box';

Amplify.configure(awsconfig);

let theme = createTheme({
  components: {
    MuiButton: {
      styleOverrides: {
        contained: {
          backgroundColor: "#408948",
        },
      },
    },
  },
  typography: {
    fontFamily: [
      "Josefin Sans",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
    grid: {
      height: "100%",
    },
    palette: {
      primary: {
        main: orange[500],
      },
      secondary: {
        main: "#408948",
      },
    },
    overrides: {
      MuiAppBar: {
        colorDefault: {
          backgroundColor: "black",
        },
      },
    },
  },
});


const App = () => {
  const [isLoaded, setIsLoaded] = React.useState(false);
  React.useEffect(() => {
    console.log('OUTERLOADING')
    const fontLoaded = document.fonts.load("12px 'Josefin Sans'");

    Promise.all([fontLoaded])
      .then(() => {
        setIsLoaded(true);
      }).catch((error) => {
        console.log('Outer App loader issue:')
        console.log(error)
      });;
  }, [])



  return (

    isLoaded ?

      <ThemeProvider theme={theme}>
        < CssBaseline />

        <Routes>

          <Route path="/signup" element={<SignUp />} />
          <Route path="/resetpassword" element={<ResetPassword />} />
          <Route path="/termsofservice" element={<Terms />} />
          <Route path="/signin" element={<SignIn />} />



          <Route path="/" element={<PrivateRoute>

            <Header />
            <NewMemberLanding />
            <Footer />

          </PrivateRoute>} />

          <Route
            path="/landing"
            element={
              <PrivateRoute>

                <Header />
                <NewMemberLanding />
                <Footer />

              </PrivateRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Header />
                <NewMemberProfile />
                <Footer />
              </PrivateRoute>
            }
          />

          <Route
            path="/admin/enrolments"
            element={
              <PrivateRoute>
                <Enrolments />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/holidays"
            element={
              <PrivateRoute>
                <Holidays />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/members"
            element={
              <PrivateRoute>
                <Members />
              </PrivateRoute>
            }
          />

          <Route path="/signout" element={<SignOut />} />
        </Routes>

      </ThemeProvider >

      : <Loading />)

}


export default App;
