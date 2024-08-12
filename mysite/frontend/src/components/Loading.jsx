import Container from "@mui/material/Container";
import CircularProgress from "@mui/material/CircularProgress";

export default function Loading() {
  return (
    <Container
      disableGutters
      sx={{
        justifyContent: "center",
        alignItems: "center",
        pt: 2, pb: 2, flexGrow: 1, display: 'flex', flexDirection: 'column'
      }}

    >
      <CircularProgress size={60} />
    </Container >
  );
}
