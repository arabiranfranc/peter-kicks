import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { StringValue } from "ms";

interface JWTPayload {
  [key: string]: any;
}

export const createJWT = (payload: JWTPayload): string => {
  const secret = process.env.JWT_SECRET as Secret;
  const expiresIn = process.env.JWT_EXPIRES_IN as StringValue | number;

  if (!secret || !expiresIn) {
    throw new Error(
      "JWT_SECRET or JWT_EXPIRES_IN is not defined in environment variables."
    );
  }

  const options: SignOptions = {
    expiresIn,
  };

  return jwt.sign(payload, secret, options);
};

export const verifyJWT = (token: string): JWTPayload | string => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables.");
  }

  const decoded = jwt.verify(token, secret);
  return decoded;
};
