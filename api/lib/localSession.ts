import * as jose from "jose";
import { env } from "./env";

const JWT_ALG = "HS256";
export const LOCAL_SESSION_COOKIE = "exsify_local_session";

export async function signLocalSession(userId: string): Promise<string> {
  const secret = new TextEncoder().encode(env.appSecret);
  return new jose.SignJWT({ userId, type: "local" })
    .setProtectedHeader({ alg: JWT_ALG })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secret);
}

export async function verifyLocalSession(token: string): Promise<string | null> {
  try {
    const secret = new TextEncoder().encode(env.appSecret);
    const { payload } = await jose.jwtVerify(token, secret, {
      algorithms: [JWT_ALG],
    });
    if (payload.type !== "local" || typeof payload.userId !== "string") {
      return null;
    }
    return payload.userId;
  } catch {
    return null;
  }
}
