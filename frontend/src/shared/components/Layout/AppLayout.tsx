import { Container, CssBaseline } from "@material-ui/core";

import { useAccessTokenContext } from "../../contexts/AccessTokenContext";
import AuthenticatedNavigation from "../Navigation/Authenticated/AuthenticatedNavigation";
import UnauthenticatedNavigation from "../Navigation/Unauthenticated/UnauthenticatedNavigation";

interface LayoutProps {}

export const AppLayout: React.FC<LayoutProps> = ({ children }) => {
  //#region Context -----------------------------------------------------------
  const auth: any = useAccessTokenContext();
  //#endregion

  //#region TSX ---------------------------------------------------------------
  return (
    <>
      <CssBaseline />
      {auth.authenticated ? (
        <AuthenticatedNavigation />
      ) : (
        <UnauthenticatedNavigation />
      )}
      <Container maxWidth="lg">
        <></>
        {children}
      </Container>
    </>
  );
  //#endregion
};
