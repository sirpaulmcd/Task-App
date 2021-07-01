import { AppBar, Container, CssBaseline, Toolbar } from "@material-ui/core";

interface LoadingLayoutProps {}

const LoadingLayout: React.FC<LoadingLayoutProps> = ({ children }) => {
  //#region TSX ---------------------------------------------------------------
  return (
    <>
      <CssBaseline />
      <AppBar position="static">
        <Container maxWidth="lg">
          <Toolbar />
        </Container>
      </AppBar>
      <Container maxWidth="lg">
        <></>
        {children}
      </Container>
    </>
  );
  //#endregion
};

export default LoadingLayout;
