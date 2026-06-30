import {
  sqliteTable,
  text,
  integer,
  primaryKey,
} from "drizzle-orm/sqlite-core";
import type { AdapterAccount } from "next-auth/adapters";

// --- AUTH.JS REQUIRED TABLES ---

export const users = sqliteTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: integer("emailVerified", { mode: "timestamp_ms" }),
  image: text("image"),
  passwordHash: text("passwordHash"), // For admin/supervisor
  role: text("role").default("anggota"), // anggota, supervisor, admin
  teamId: text("teamId"), // references teams.id
  status: text("status").default("pending"), // pending, active, rejected
  city: text("city"),
  phone: text("phone"),
  institution: text("institution"),
  address: text("address"),
});

export const accounts = sqliteTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const sessions = sqliteTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
});

export const verificationTokens = sqliteTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);

// --- DOMAIN TABLES ---

export const teams = sqliteTable("team", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  description: text("description"),
  createdAt: integer("createdAt", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
});

export const schools = sqliteTable("school", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  address: text("address"),
  contactPerson: text("contactPerson"),
  contactPhone: text("contactPhone"),
  createdAt: integer("createdAt", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
});

export const teamSchoolAssignments = sqliteTable("team_school_assignment", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  teamId: text("teamId")
    .notNull()
    .references(() => teams.id, { onDelete: "cascade" }),
  schoolId: text("schoolId")
    .notNull()
    .references(() => schools.id, { onDelete: "cascade" }),
  assignedAt: integer("assignedAt", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
});

export const events = sqliteTable("event", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  description: text("description"),
  eventDate: text("eventDate"),
  eventTime: text("eventTime"),
  createdAt: integer("createdAt", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
});

export const eventTeamAssignments = sqliteTable("event_team_assignment", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  eventId: text("eventId")
    .notNull()
    .references(() => events.id, { onDelete: "cascade" }),
  teamId: text("teamId")
    .notNull()
    .references(() => teams.id, { onDelete: "cascade" }),
  assignedAt: integer("assignedAt", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
});

export const meetings = sqliteTable("meeting", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  schoolId: text("schoolId")
    .references(() => schools.id, { onDelete: "cascade" }),
  eventId: text("eventId")
    .references(() => events.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  orderIndex: integer("orderIndex").default(0),
  createdAt: integer("createdAt", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
});

export const submissions = sqliteTable("submission", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  meetingId: text("meetingId")
    .references(() => meetings.id, { onDelete: "cascade" }),
  eventId: text("eventId")
    .references(() => events.id, { onDelete: "cascade" }),
  teamId: text("teamId")
    .references(() => teams.id, { onDelete: "set null" }),
  submittedBy: text("submittedBy")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  driveLink: text("driveLink").notNull(),
  status: text("status").default("pending"), // pending, approved, revision
  feedback: text("feedback"),
  reviewedBy: text("reviewedBy"),
  reviewedAt: integer("reviewedAt", { mode: "timestamp_ms" }),
  cleanUrlSlug: text("cleanUrlSlug"),
  submittedAt: integer("submittedAt", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
  updatedAt: integer("updatedAt", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
});

// --- RETAINED TABLES ---

export const news = sqliteTable("news", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  summary: text("summary").notNull(),
  content: text("content").notNull(),
  category: text("category").default("Umum"),
  createdAt: integer("createdAt", { mode: "timestamp_ms" })
    .$defaultFn(() => new Date()),
});

export const spotlights = sqliteTable("spotlight", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  type: text("type").notNull(), // Knowledge, News, Pemberitahuan
  content: text("content").notNull(),
  imageUrl: text("imageUrl"),
  authorId: text("authorId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  teamId: text("teamId")
    .references(() => teams.id, { onDelete: "set null" }),
  createdAt: integer("createdAt", { mode: "timestamp_ms" })
    .$defaultFn(() => new Date()),
});

export const assets = sqliteTable("asset", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  type: text("type").notNull(), // link, folder
  link: text("link").notNull(),
  size: text("size"),
  createdAt: integer("createdAt", { mode: "timestamp_ms" })
    .$defaultFn(() => new Date()),
});

export const reports = sqliteTable("report", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  type: text("type").notNull(), // weekly, monthly, semester
  generatedBy: text("generatedBy")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  fileUrl: text("fileUrl").notNull(),
  parameters: text("parameters").notNull(), // JSON string
  createdAt: integer("createdAt", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
});

export const notifications = sqliteTable("notification", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").notNull(), // task, announcement, revision, approval
  isRead: integer("isRead", { mode: "boolean" }).default(false),
  link: text("link"),
  createdAt: integer("createdAt", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
});
