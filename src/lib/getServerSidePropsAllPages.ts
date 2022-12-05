import { getCookie } from "cookies-next";
import { auth } from "../auth/firebaseAdmin";
import { User } from "../store/accountStore";

export const getServerSidePropsAllPages = async ({
  req,
  res,
}: {
  req: any;
  res: any;
}) => {
  let authedUser: User | null = null;
  let authError: { code: string; message: string } | null = null;
  if (typeof window === "undefined") {
    const idToken = getCookie("idToken", { req, res });
    if (idToken) {
      try {
        const userData = await auth.verifyIdToken(idToken as string);
        authedUser = {
          idToken: idToken as string,
          userId: userData.uid,
          sessionExpires: userData.exp, // Like this: 1670002416
          displayName: userData.name || "",
          email: userData.email || "",
        };
      } catch (e: any) {
        authError = {
          code: e.code,
          message: e.message,
        };
      }
    }
  }

  return {
    props: {
      authedUser,
      authError,
    },
  };
};
