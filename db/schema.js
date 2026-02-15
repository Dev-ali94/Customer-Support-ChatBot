import { sql } from "drizzle-orm";
import { pgTable, text } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
    id: text("id").primaryKey().default(sql`gen_random_uuid()`),
    organization_id: text("organization_id").notNull(),
    email: text("email").notNull().unique(),
    name: text("name"),
    image: text("image"),
    created_at: text("created_at").default(sql`now()`)
})

export const businessDetail = pgTable("business_detail", {
    id: text("id").primaryKey().default(sql`gen_random_uuid()`),
    user_email: text("user_email").notNull(),
    business_name: text("business_name").notNull(),
    website_url: text("website_url").notNull(),
    external_link: text("external_link").notNull(),
    created_at: text("created_at").default(sql`now()`)
})