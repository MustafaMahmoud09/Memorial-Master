import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const duasTable = pgTable("duas", {
  id: serial("id").primaryKey(),
  text: text("text").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertDuaSchema = createInsertSchema(duasTable).omit({ id: true, createdAt: true });
export type InsertDua = z.infer<typeof insertDuaSchema>;
export type Dua = typeof duasTable.$inferSelect;
