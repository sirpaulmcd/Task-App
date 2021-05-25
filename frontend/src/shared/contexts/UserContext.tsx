import axios from "axios";
import React, {
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { useAccessTokenContext } from "./AccessTokenContext";

//#region User context hook ===================================================

export const UserContext = React.createContext({});

/**
 * This export allows this context to be used with a single import rather than
 * importing UserContext and useContext separately.
 */
export const useUserContext = () => {
  return useContext(UserContext);
};

//#endregion

//#region User context provider ===============================================

export const UserContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState(null);
  const auth: any = useAccessTokenContext();

  /**
   * Retrieves public information of the current user and stores it in the user
   * context.
   */
  const getMeQuery = useCallback(async () => {
    await axios
      .get("http://localhost:8000/users/me")
      .then((res) => {
        setUser(res.data);
      })
      .catch((error) => {
        setUser(null);
        console.log(error);
      });
  }, []);

  /**
   * If the `authenticated` status of the user is changed to true, a getMeQuery
   * is performed to populate the user context.
   */
  useEffect(() => {
    if (auth.authenticated === true) {
      getMeQuery();
    }
  }, [auth.authenticated, getMeQuery]);

  return (
    <UserContext.Provider value={[user, setUser]}>
      {children}
    </UserContext.Provider>
  );
};

//#endregion
