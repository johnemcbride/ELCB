

import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Amplify, Analytics } from "aws-amplify";
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

Amplify.configure(config);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
