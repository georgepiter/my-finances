export interface SignInProps {
  username: string;
  password: string;
  rememberMe: boolean;
}

export const setSignInSettings = async (settings: SignInProps) => {
  try {
    const key = `@${process.env.APP_NAME + ":remember-me"}`;
    await localStorage.setItem(key, JSON.stringify(settings));

  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getSignInSettings = async () => {
  const key = `@${process.env.APP_NAME + ":remember-me"}`;

  try {
    const storaged = await localStorage.getItem(key);
    return storaged ? JSON.parse(storaged) as SignInProps : null;
  } catch (error) {
    console.log(error);
    throw error;
  }
};