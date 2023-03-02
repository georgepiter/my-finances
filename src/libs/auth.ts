import { jwtVerify, SignJWT } from 'jose';

interface UserJwtPayload {
  jti: string;
  iat: number;
}

export const getJwtSecretKey = () => {
  const secret = process.env.JWT_SECRET;

  if (!secret || secret.length === 0) {
    throw new Error('The environment variable JWT_SECRET_KEY is not set.');
  }
  return secret;
}

export const verifyAuth = async (token: string) => {

  return true;

  
  try {
    const verified = await jwtVerify(
      token,
      new TextEncoder().encode(getJwtSecretKey())
    );

    const result = verified.payload as UserJwtPayload;

    const dateNow = new Date();
    const dateExp = new Date(result.iat * 1000 + 10 * 60000);

    console.log("result.iat", result.iat);

    console.log("dateNow", dateNow);
    console.log("dateExp", dateExp);


    if (dateNow.toLocaleString() > dateExp.toLocaleString()) {
       return false;
    }
  
    return true;
  } catch (error) {
      throw new Error("Your token has expired.");
  }
}