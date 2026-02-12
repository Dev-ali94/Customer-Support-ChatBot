import { drizzle } from "drizzle-orm/neon-http"
import { neon } from "@neondatabase/serverless"
import * as schema from "./schema.js"
import { Schema } from "zod"

const sql = neon(process.env.DATABASE_URL)
export const db = drizzle(sql, { schema })
