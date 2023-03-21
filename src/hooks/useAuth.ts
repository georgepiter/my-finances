import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function useAuth(shouldRedirect: any) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {

      console.log("session", session);


    if (session?.error === "TokenExpiredError") {

      console.log("TokenExpiredError");

      signOut({ callbackUrl: "/signIn", redirect: shouldRedirect });

    } else {
      console.log("N  TokenExpiredError");

    }

    if (session === null ) {
        signOut({ callbackUrl: "/signIn", redirect: shouldRedirect });
      setIsAuthenticated(false);
    } else if (session !== undefined) {
      setIsAuthenticated(true);
    }
  }, [session]);

  return isAuthenticated;
}
