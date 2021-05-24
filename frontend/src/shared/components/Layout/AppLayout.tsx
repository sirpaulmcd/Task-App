import { Container, CssBaseline } from "@material-ui/core";

interface LayoutProps {}

export const AppLayout: React.FC<LayoutProps> = ({ children }) => {
  //#region TSX
  return (
    <>
      <CssBaseline />
      <Container maxWidth="lg">
        <></>
        {children}
      </Container>
    </>
  );
  //#endregion
};
