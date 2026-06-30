"use server";

import { getAppSession } from "./auth";

export type AllowedRole = "admin" | "supervisor" | "anggota" | "direktur" | "manager";

/**
 * Validasi sesi + peran pengguna di Server Actions.
 * Throws error jika sesi tidak ada atau peran tidak diizinkan.
 */
export async function requireRole(...allowedRoles: AllowedRole[]) {
  const session = await getAppSession();
  if (!session?.user) {
    throw new Error("Sesi tidak valid. Silakan login ulang.");
  }

  const role = (session.user as any).role as string;
  if (!allowedRoles.includes(role as AllowedRole)) {
    throw new Error("Akses ditolak: Anda tidak memiliki otoritas untuk aksi ini.");
  }

  return session;
}

/**
 * Helper: cek apakah sesi ada (tanpa cek peran).
 */
export async function requireAuth() {
  const session = await getAppSession();
  if (!session?.user) {
    throw new Error("Sesi tidak valid. Silakan login ulang.");
  }
  return session;
}
