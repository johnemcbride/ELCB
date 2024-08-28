import React from "react";
import Box from '@mui/material/Box';
import { router } from '@inertiajs/react'

export function PrivateRoute(props) {

  console.log(props)
  React.useEffect(() => {

    if (props.user === null) {
      console.log('User null')
      router.visit("/signin");
    }
    else (
      console.log(props.user)
    )
    const renderChildren = () => {
      return React.Children.map(props.children, (child) => {
        return React.cloneElement(child, { ...props });
      });
    };
    const children = renderChildren()
    return <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
      children={children}
    />
  }
  )
}