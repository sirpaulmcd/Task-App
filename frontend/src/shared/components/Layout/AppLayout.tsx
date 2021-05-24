import { Container, CssBaseline } from "@material-ui/core";

import UnauthenticatedNavigation from "../Navigation/Unauthenticated/UnauthenticatedNavigation";

interface LayoutProps {}

export const AppLayout: React.FC<LayoutProps> = ({ children }) => {
  //#region TSX
  return (
    <>
      <CssBaseline />
      <UnauthenticatedNavigation />
      <Container maxWidth="lg">
        <></>
        {children}
      </Container>
    </>
  );
  //#endregion
};
