import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { db } from "./db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

const MASTER_ADMIN_EMAIL = "mhmmadridho64@gmail.com";

const authConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      id: "admin-login",
      name: "Admin Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email as string;
        const password = credentials?.password as string;

        if (!email || !password) return null;

        const dbUser = await db.select().from(users).where(eq(users.email, email)).limit(1);
        if (dbUser.length === 0) return null;

        const user = dbUser[0];

        // Hanya admin/supervisor yang boleh login via credentials
        if (user.role !== "admin" && user.role !== "supervisor" && user.role !== "direktur" && user.role !== "manager") {
          return null;
        }

        if (user.status !== "active") return null;
        if (!user.passwordHash) return null;

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          teamId: user.teamId,
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/",
  },
  callbacks: {
    async signIn({ user, account }: { user: any, account: any }) {
      // Credentials provider — sudah divalidasi di authorize()
      if (account?.provider === "admin-login") {
        return true;
      }

      if (account?.provider === "google") {
        const email = user.email as string;
        
        // Auto-approve Master Admin
        if (email === MASTER_ADMIN_EMAIL) {
          const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);
          if (existingUser.length === 0) {
            await db.insert(users).values({
              name: user.name || "Master Admin",
              email: email,
              role: "admin",
              status: "active",
              teamId: null
            });
          } else if (
            existingUser[0].role !== "admin" ||
            existingUser[0].status !== "active" ||
            existingUser[0].teamId === "all"
          ) {
            await db.update(users).set({ role: "admin", status: "active", teamId: null }).where(eq(users.email, email));
          }
          return true;
        }
        
        // Cek user yang ada
        const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);
        if (existingUser.length > 0) {
          if (existingUser[0].status === "pending") {
            return `/?error=${encodeURIComponent("Akun Anda sedang dalam antrean persetujuan Admin.")}`;
          }
          if (existingUser[0].status === "rejected") {
            return `/?error=${encodeURIComponent("Pendaftaran Anda ditolak.")}`;
          }
          return true;
        }

        // Belum daftar -> Lempar ke form registrasi
        return `/?mode=register&email=${encodeURIComponent(email)}&name=${encodeURIComponent(user.name || "")}&google=true`;
      }
      return true;
    },
    async jwt({ token }: { token: any }) {
      if (token.email) {
        const dbUser = await db.select().from(users).where(eq(users.email, token.email)).limit(1);
        if (dbUser[0]) {
          token.role = dbUser[0].role;
          token.teamId = dbUser[0].teamId;
          token.id = dbUser[0].id;
          token.status = dbUser[0].status;
        }
      }
      return token;
    },
    async session({ session, token }: { session: any, token: any }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).teamId = token.teamId;
      }
      return session;
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig as any);

export async function getAppSession() {
  const session = await auth();
  return session;
}
