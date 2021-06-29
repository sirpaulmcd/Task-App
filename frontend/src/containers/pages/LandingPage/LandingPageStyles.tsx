import { makeStyles } from "@material-ui/core/styles";

const useLandingPageStyles = makeStyles((theme) => ({
  landingPage_container: {
    display: "flex",
    flexDirection: "column",
    margin: "30px",
  },
  landingPage_disclaimerContainer: {
    marginTop: "20px",
  },
  landingPage_caption: {
    marginTop: "10px",
  },
  landingPage_image: {
    marginTop: "10px",
    alignSelf: "center",
    width: "auto",
    [theme.breakpoints.down("xs")]: {
      width: "100%",
    },
  },
  landingPage_signUpButton: {
    marginTop: "15px",
    alignSelf: "center",
    width: "300px",
    [theme.breakpoints.down("xs")]: {
      width: "fit-content",
    },
  },
}));

export default useLandingPageStyles;
