import { createContext, ReactNode, useEffect, useState } from "react";

export interface UserProps {
  user: {
    photo: string;
  };
}

export interface ProfileContextDataProps {
  userProfile: UserProps;
  setProfile: (profile: UserProps) => Promise<void>;
}

interface ProfileProviderProps {
  children: ReactNode;
}

export const ProfileContext = createContext({} as ProfileContextDataProps);

export function ProfileContextProvider({ children }: ProfileProviderProps) {
  const key = `@${process.env.APP_NAME + ":photo"}`;

  const [userProfile, setUserProfile] = useState<UserProps>({} as UserProps);


  async function setProfile(profile: UserProps) {
    try {
      await localStorage.setItem(key, JSON.stringify(profile));
      setUserProfile(profile);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  useEffect(() => {
    async function loadStorageDate() {
      const userStoraged = await localStorage.getItem(key);

      if (userStoraged) {
        const userLogged = JSON.parse(userStoraged) as UserProps;
        setUserProfile(userLogged);
      }
    }
    loadStorageDate();
  }, []);


   return (
     <ProfileContext.Provider
       value={{
         setProfile,
         userProfile,
       }}
     >
       {children}
     </ProfileContext.Provider>
   );

}

