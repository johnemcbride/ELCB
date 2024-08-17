

import { orange } from "@mui/material/colors";
import React from "react";
import ReactDOM from "react-dom/client";
import "@fontsource/josefin-sans";
import { createRoot } from 'react-dom/client'
import { createInertiaApp } from '@inertiajs/react'
import "./index.css";
import App from "./App.jsx";
import { Amplify, Analytics } from "aws-amplify";

import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";
//import { Amplify } from "aws-amplify";

import config from "./aws-exports";
import { Hub } from "aws-amplify";
import { BrowserRouter } from "react-router-dom";

Analytics.autoTrack("session", {
  // REQUIRED, turn on/off the auto tracking
  enable: true,
  // OPTIONAL, the attributes of the event, you can either pass an object or a function
  // which allows you to define dynamic attributes
  attributes: {
    attr: "attr",
  },
  // when using function
  // attributes: () => {
  //    const attr = somewhere();
  //    return {
  //        myAttr: attr
  //    }
  // },
  // OPTIONAL, the service provider, by default is the Amazon Pinpoint
  provider: "AWSPinpoint",
});
Analytics.autoTrack("pageView", {
  // REQUIRED, turn on/off the auto tracking
  enable: true,
  // OPTIONAL, the event name, by default is 'pageView'
  eventName: "pageView",
  // OPTIONAL, the attributes of the event, you can either pass an object or a function
  // which allows you to define dynamic attributes
  attributes: {
    attr: "attr",
  },
  // when using function
  // attributes: () => {
  //    const attr = somewhere();
  //    return {
  //        myAttr: attr
  //    }
  // },
  // OPTIONAL, by default is 'multiPageApp'
  // you need to change it to 'SPA' if your app is a single-page app like React
  type: "SPA",
  // OPTIONAL, the service provider, by default is the Amazon Pinpoint
  provider: "AWSPinpoint",
  // OPTIONAL, to get the current page url
  getUrl: () => {
    // the default function
    return window.location.origin + window.location.pathname;
  },
});
Analytics.record({ name: "visit" });
function listenToAutoSignInEvent() {
  Hub.listen("auth", ({ payload }) => {
    const { event } = payload;
    if (event === "autoSignIn") {
      const user = payload.data;
      console.log("autosign in happened");
      console.log(user);
    } else if (event === "autoSignIn_failure") {
      // redirect to sign in page
    }
  });
}

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


Amplify.configure(config);

// const root = ReactDOM.createRoot(document.getElementById("root"));
// root.render(
//   <BrowserRouter basename='/cms/pages/3/edit/preview/'>
//     <App />
//   </BrowserRouter>
// );

createInertiaApp({
  id: 'app',
  resolve: name => {
    const pages = import.meta.glob('./components/*.jsx', { eager: true })
    return pages[`./components/${name}.jsx`]
  },
  setup({ el, App, props }) {
    createRoot(el).render(


      <ThemeProvider theme={theme}>
        < CssBaseline />
        <BrowserRouter ><App {...props} /></BrowserRouter></ThemeProvider>)
  },
})
