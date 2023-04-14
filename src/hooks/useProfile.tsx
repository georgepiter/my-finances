import { useContext } from "react";

import { ProfileContext, ProfileContextDataProps } from "@/contexts/ProfileContext";

export function useProfile(): ProfileContextDataProps {
  const context = useContext(ProfileContext);

  return context;
}
