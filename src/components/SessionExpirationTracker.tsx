import { refresh } from "@jaws/auth/firestoreAuth";
import { ONE_HOUR_IN_MS, SESSION_LENGTH_IN_MS } from "@jaws/lib/helpers";
import { setCookies } from "cookies-next";
import { useClickAnyWhere, useInterval } from "usehooks-ts";

export interface Props {
  children?: any;
}

export const SessionExpirationTracker = ({ children }: Props) => {
  const [interval, setInterval] = useState(SESSION_LENGTH_IN_MS);
  const [user, setUser, logoutUser] = useStore(store, (state) => [
    state.user,
    state.setUser,
    state.logoutUser,
  ]);

  let latestInteraction = Date.now();
  useClickAnyWhere(() => {
    latestInteraction = Date.now();
    setInterval(0);

    async function doRefresh() {
      if (
        !user ||
        (user.sessionExpires &&
          user.sessionExpires - Date.now() > SESSION_LENGTH_IN_MS)
      ) {
        // Only refresh token if less then SESSION_LENGTH_IN_MS left
        return;
      }

      try {
        const newToken = await refresh();
        if (newToken) {
          setCookies("idToken", newToken);
          setUser({
            ...user,
            sessionExpires: Date.now() + ONE_HOUR_IN_MS,
          });
        }
      } catch (err) {
        console.log("Refresh token failed", JSON.stringify(err));
      }
    }
    void doRefresh();
  });

  useInterval(() => {
    setInterval(SESSION_LENGTH_IN_MS);
    if (user && Date.now() - latestInteraction > SESSION_LENGTH_IN_MS) {
      // Session time expired - lets logout
      logoutUser();
      return;
    }
  }, interval);
  return <>{children}</>;
};
