import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function useAuth(shouldRedirect: any) {
  const { data: session } = useSession();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (session?.error === "TokenExpiredError" || session === null) {
      signOut({ callbackUrl: "/signIn", redirect: shouldRedirect });

      setIsAuthenticated(false);
    } else {
      setIsAuthenticated(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  return isAuthenticated;
}
