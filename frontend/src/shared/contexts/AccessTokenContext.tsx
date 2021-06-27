import axios from "axios";
import React, {
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

//#region Access token context hook ===========================================

export const AccessTokenContext = React.createContext({});

/**
 * This export allows this context to be used with a single import rather than
 * importing AccessTokenContext and useContext separately.
 */
export const useAccessTokenContext = () => {
  return useContext(AccessTokenContext);
};

//#endregion

//#region Access token context provider =======================================

export const AccessTokenContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  //#region Access token management -------------------------------------------
  const [accessToken, setAccessToken] = useState("");
  const [authenticated, setAuthenticated] = useState(false);

  /**
   * Automatically set access token in Auth header and enable cookies
   */
  axios.defaults.headers.common["Authorization"] = accessToken;
  axios.defaults.withCredentials = true;

  /**
   * Signs user in by setting access token.
   */
  const login = useCallback((value: string): void => {
    setAccessToken(value);
  }, []);

  /**
   * Authentication is toggled whenever the state of the access token changes.
   * The `authenticated` boolean is used to tell the rest of the react
   * components whether or not the user is authenticated.
   */
  useEffect(() => {
    if (accessToken) {
      setAuthenticated(true);
    } else {
      setAuthenticated(false);
    }
  }, [accessToken]);

  /**
   * Signs user out by erasing the session's refresh token from the database
   * and setting the local access token state to an empty string.
   */
  const logout = useCallback(async () => {
    await axios
      .post(`${process.env.REACT_APP_BACKEND_URI}/users/logout`, {})
      .catch((error) => {
        console.log(error);
      });
    setAccessToken("");
    window.location.reload();
  }, []);
  //#endregion

  //#region Periodically renewing tokens --------------------------------------
  const [loading, setLoading] = useState(true);

  /**
   * Renews access/refresh tokens. Note that access tokens are stored in react
   * state and refresh tokens are stored in HTTPOnly browser cookies.
   */
  const renewTokensMutation = useCallback(async () => {
    setLoading(true);
    await axios
      .post(`${process.env.REACT_APP_BACKEND_URI}/users/refresh`)
      .then((res) => {
        if (res.status === 200) {
          login(res.data.accessToken);
        } else {
          logout();
        }
      })
      .catch((error) => {
        console.log(error);
      });
    setLoading(false);
  }, [login, logout]);

  /**
   * Renew tokens is ran when a user initially loads the app (or after
   * refreshing). If the user's refresh token is valid, their access/refresh
   * tokens are renewed. This allows users to remain authenticated after
   * refreshing the page or after the browser has been closed. Afterwards,
   * tokens are renewed every 14.5 minutes to ensure that the access token is
   * replaced before its 15 minute expiration time. This is known as silent
   * authentication.
   */
  useEffect(() => {
    renewTokensMutation();
    setInterval(renewTokensMutation, 870000);
  }, [renewTokensMutation]);
  //#endregion

  //#region TSX ---------------------------------------------------------------
  return (
    <AccessTokenContext.Provider
      value={{
        authenticated,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AccessTokenContext.Provider>
  );
  //#endregion
};

//#endregion
