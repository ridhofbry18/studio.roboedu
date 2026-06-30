import { SignJWT, jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

// Pastikan untuk mendefinisikan kunci JWT di env production. Default fallback untuk dev.
const JWT_SECRET = process.env.JWT_SECRET || "roboedu_secret_key_change_in_production";
const secretKey = new TextEncoder().encode(JWT_SECRET);

export interface ApiUserPayload {
  id: string;
  email: string;
  role: string;
  teamId: string | null;
}

export async function createApiToken(payload: ApiUserPayload): Promise<string> {
  const jwt = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d") // Sesi berlaku 30 hari untuk mobile app
    .sign(secretKey);
  return jwt;
}

export async function verifyApiToken(token: string): Promise<ApiUserPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey);
    return payload as unknown as ApiUserPayload;
  } catch (err) {
    return null;
  }
}

/**
 * Middleware untuk rute API.
 * Mengembalikan objek user jika token valid, jika tidak mengembalikan null.
 */
export async function requireApiAuth(req: NextRequest, allowedRoles?: string[]): Promise<ApiUserPayload | null> {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.split(" ")[1];
  const user = await verifyApiToken(token);

  if (!user) return null;

  if (allowedRoles && allowedRoles.length > 0) {
    if (!allowedRoles.includes(user.role)) {
      return null;
    }
  }

  return user;
}

export function unauthorizedResponse(message: string = "Unauthorized") {
  return NextResponse.json({ error: message }, { status: 401 });
}

export function forbiddenResponse(message: string = "Forbidden") {
  return NextResponse.json({ error: message }, { status: 403 });
}
