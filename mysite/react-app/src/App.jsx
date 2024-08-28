import React, { Suspense } from "react";
import Terms from "./components/Terms.jsx";
import ResetPassword from "./components/ResetPassword.jsx";
import { Amplify } from "aws-amplify";
import NewMemberLanding from "./components/NewMemberLanding.jsx";
import SignIn from "./components/SignIn.jsx";
import SignUp from "./components/SignUp.jsx";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import SignOut from "./components/SignOut.jsx";
import NewMemberProfile from "./components/NewMemberProfile.jsx";
import { Routes, Route } from "react-router-dom";
import Enrolments from "./pages/admin/Enrolments.jsx"
import Members from "./pages/admin/Members.jsx"
import Holidays from "./pages/admin/Holidays.jsx"
import awsconfig from "./aws-exports";
import { PrivateRoute } from "./components/PrivateRoute.jsx";
import Loading from "./components/Loading.jsx";

//------
import { ErrorBoundary } from "react-error-boundary";



Amplify.configure(awsconfig);


const App = (props) => {

  console.log('JOHN DEBUG')
  console.log(props)
  const [isLoaded, setIsLoaded] = React.useState(false);
  React.useEffect(() => {
    console.log('ELCB Migration Underway')
    const fontLoaded = document.fonts.load("12px 'Josefin Sans'");
    console.log(fontLoaded)

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
      <>
        <ErrorBoundary fallback={<div>Something went wrong in App.js</div>}>
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>


              <Route path="/signup" element={
                <Suspense fallback={<div>Loading...</div>}>
                  <SignUp {...props} />
                </Suspense>} />

              {/* <Route path="/pages/" element={<SignUp />} /> */}

              <Route path="/" element={
                <Suspense fallback={<div>Loading...</div>}>
                  <SignUp {...props} />
                </Suspense>} />
              <Route path="/resetpassword" element={
                <Suspense fallback={<div>Loading...</div>}>
                  <ResetPassword {...props} />
                </Suspense>} />
              <Route path="/termsofservice" element={
                <Suspense fallback={<div>Loading...</div>}>
                  <Terms />
                </Suspense>} />
              <Route path="/signin" element={
                <Suspense fallback={<div>Loading...</div>}>
                  <SignIn {...props} />
                </Suspense>} />



              <Route path="/" element={
                <Suspense fallback={<div>Loading...</div>}>
                  <PrivateRoute>
                    <Header />
                    <NewMemberLanding {...props} />
                    <Footer />
                  </PrivateRoute>
                </Suspense>} />

              <Route
                path="/landing"
                element={
                  <Suspense fallback={<div>Loading...</div>}>
                    <PrivateRoute>
                      <Header />
                      <NewMemberLanding  {...props} />
                      <Footer />
                    </PrivateRoute>
                  </Suspense>
                }
              />

              <Route
                path="/profile"
                element={
                  <Suspense fallback={<div>Loading...</div>}>
                    <PrivateRoute>
                      <Header />
                      <NewMemberProfile {...props} />
                      <Footer />
                    </PrivateRoute>
                  </Suspense>
                }
              />

              <Route
                path="/admin/enrolments"
                element={
                  <Suspense fallback={<div>Loading...</div>}>
                    <PrivateRoute>
                      <Enrolments {...props} />
                    </PrivateRoute>
                  </Suspense>
                }
              />
              <Route
                path="/admin/holidays"
                element={
                  <Suspense fallback={<div>Loading...</div>}>
                    <PrivateRoute>
                      <Holidays {...props} />
                    </PrivateRoute>
                  </Suspense>
                }
              />
              <Route
                path="/admin/members"
                element={
                  <Suspense fallback={<div>Loading...</div>}>
                    <PrivateRoute>
                      <Members {...props} />
                    </PrivateRoute>
                  </Suspense>
                }
              />

              <Route path="/signout" element={
                <Suspense fallback={<div>Loading...</div>}>
                  <SignOut {...props} />
                </Suspense>} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </>

      : (<ErrorBoundary fallback={<div>Something went wrong in App.js Loading bar</div>}>
        <Loading />
      </ErrorBoundary>))

}


export default App;
