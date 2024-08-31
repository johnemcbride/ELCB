import { ErrorBoundary } from "react-error-boundary";
import { orange } from "@mui/material/colors";
import React, { Suspense } from "react";
import "@fontsource/josefin-sans";
import { createRoot } from 'react-dom/client'
import { createInertiaApp } from '@inertiajs/react'
import "./index.css";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";

import { BrowserRouter } from "react-router-dom";




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




function fallbackRender({ error, resetErrorBoundary }) {
  // Call resetErrorBoundary() to reset the error boundary and retry the render.

  return (
    <div role="alert">
      <p>Something went wrong at top level:</p>
      <pre style={{ color: "purple" }}>{error.message}</pre>
    </div>
  );
}

createInertiaApp({
  id: 'app',
  resolve: name => {
    const pages = import.meta.glob('./components/*.jsx', { eager: true })
    return pages[`./components/${name}.jsx`]
  },
  setup({ el, App, props }) {
    createRoot(el).render(

      <ErrorBoundary fallbackRender={fallbackRender}>
        <Suspense>
          <ThemeProvider theme={theme}>
            < CssBaseline />
            <BrowserRouter >
              <App {...props} />
            </BrowserRouter>
          </ThemeProvider>
        </Suspense>
      </ErrorBoundary>)
  },
})
