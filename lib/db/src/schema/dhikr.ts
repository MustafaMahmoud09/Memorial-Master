import { pgTable, serial, text, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const dhikrCountsTable = pgTable("dhikr_counts", {
  id: serial("id").primaryKey(),
  dhikrKey: text("dhikr_key").notNull().unique(),
  count: integer("count").notNull().default(0),
});

export const insertDhikrCountSchema = createInsertSchema(dhikrCountsTable).omit({ id: true });
export type InsertDhikrCount = z.infer<typeof insertDhikrCountSchema>;
export type DhikrCount = typeof dhikrCountsTable.$inferSelect;
