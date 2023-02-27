import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function useAuth(shouldRedirect) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    
    if (session?.error === "TokenExpiredError") {

      console.log("session expirou ");
        signOut({
            callbackUrl: `${window.location.origin}/signIn`,
           redirect: shouldRedirect,
        });

    }

    if (session === null) {
      if (router.route !== "/signIn") {
        router.replace("/signIn");
      }
      setIsAuthenticated(false);
    } else if (session !== undefined) {
      if (router.route === "/signIn") {
        router.replace("/");
      }
      setIsAuthenticated(true);
    }
  }, [session]);

  return isAuthenticated;
}
