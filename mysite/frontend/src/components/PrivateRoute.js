import React, { FC, useContext } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { Auth } from "aws-amplify";

import Box from '@mui/material/Box';
export function PrivateRoute(props) {
  const navigate = useNavigate();

  const [groups, setGroups] = React.useState([]);
  const [session, setSession] = React.useState({})
  const [isLoaded, setIsLoaded] = React.useState(false)

  React.useEffect(() => {
    console.log('PRIVATEROOTWRAPPER')

    let getSession = Auth.currentSession();
    let getUser = Auth.currentAuthenticatedUser();


    Promise.all([getSession, getUser])
      .then((values) => {
        const session = values[0];
        const user = values[1];
        user.refreshSession(session.refreshToken, (err, session) => {
          setSession(session)
          setGroups(session.idToken.payload["cognito:groups"] || []);
          setIsLoaded(true)
        })

      }).catch((error) => {
        console.log('Outer App loader issue:')
        console.log(error)
        return navigate("/signin");
      });;
  }, [])


  const renderChildren = () => {
    return React.Children.map(props.children, (child) => {
      return React.cloneElement(child, {
        groups: groups,
        session: session
      });
    });
  };

  const children = isLoaded ? renderChildren() : <></>

  return <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
    }}
    children={children}
  />
    ;
}
