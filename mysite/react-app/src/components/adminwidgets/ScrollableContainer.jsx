import React from "react";
import { Container, Box, AppBar, Toolbar, Typography } from "@mui/material";
import { ArrowUpward, ArrowDownward } from "@mui/icons-material";

export const ScrollableContainer = (props) => {
  const containerRef = React.useRef(null);

  return (
    <Container
      sx={{
        height: "70vh",
        overflowY: "auto",
        position: "relative",
      }}
      ref={containerRef}
    >
      <Box sx={{ position: "relative" }}>
        <Box>{props.children}</Box>
      </Box>
    </Container>
  );
};

export default ScrollableContainer;
