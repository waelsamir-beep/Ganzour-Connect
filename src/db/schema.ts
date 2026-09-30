import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  timestamp,
  real,
} from "drizzle-orm/pg-core";

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  icon: text("icon").notNull().default("🔧"),
  description: text("description"),
  /** القسم الرئيسي اللي التصنيف تابع ليه */
  section: text("section").notNull().default("الحرفيين"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const craftsmen = pgTable("craftsmen", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  profession: text("profession").notNull(),
  categoryId: integer("category_id").references(() => categories.id, {
    onDelete: "set null",
  }),
  phone: text("phone").notNull(),
  whatsapp: text("whatsapp"),
  location: text("location").notNull().default("جنزور"),
  address: text("address"),
  description: text("description"),
  experienceYears: integer("experience_years").default(1),
  rating: real("rating").default(4.5),
  ratingsCount: integer("ratings_count").default(0),
  views: integer("views").default(0),
  verified: boolean("verified").default(false),
  available: boolean("available").default(true),
  featured: boolean("featured").default(false),
  avatarEmoji: text("avatar_emoji").default("👷"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  craftsmanId: integer("craftsman_id")
    .references(() => craftsmen.id, { onDelete: "cascade" })
    .notNull(),
  reviewerName: text("reviewer_name").notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow(),
});

/** طلبات انضمام المهنيين - تصل للإدارة وتحتاج موافقة */
export const joinRequests = pgTable("join_requests", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  profession: text("profession").notNull(),
  categoryId: integer("category_id").references(() => categories.id, {
    onDelete: "set null",
  }),
  location: text("location"),
  note: text("note"),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

/** إعلانات الإدارة - تظهر أعلى الموقع */
export const announcements = pgTable("announcements", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export type JoinRequest = typeof joinRequests.$inferSelect;
export type Announcement = typeof announcements.$inferSelect;
export type Category = typeof categories.$inferSelect;
export type Craftsman = typeof craftsmen.$inferSelect;
export type Review = typeof reviews.$inferSelect;
