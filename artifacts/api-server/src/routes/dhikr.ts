import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, dhikrCountsTable } from "@workspace/db";
import {
  IncrementDhikrBody,
  GetDhikrCountsResponse,
  IncrementDhikrResponse,
} from "@workspace/api-zod";

const DHIKR_KEYS = [
  "SubhanAllah",
  "Alhamdulillah",
  "AllahuAkbar",
  "LaIlahaIllAllah",
  "LaHawla",
  "Astaghfirullah",
  "SubhanAllahWaBiHamdihi",
  "SubhanAllahAlAzeem",
  "Salawat",
] as const;

type DhikrKey = (typeof DHIKR_KEYS)[number];

async function getAllCounts(): Promise<Record<DhikrKey, number>> {
  const rows = await db.select().from(dhikrCountsTable);
  const result = Object.fromEntries(
    DHIKR_KEYS.map((k) => [k, 0])
  ) as Record<DhikrKey, number>;
  for (const row of rows) {
    if (DHIKR_KEYS.includes(row.dhikrKey as DhikrKey)) {
      result[row.dhikrKey as DhikrKey] = row.count;
    }
  }
  return result;
}

const router: IRouter = Router();

router.get("/dhikr/counts", async (_req, res): Promise<void> => {
  const counts = await getAllCounts();
  res.json(GetDhikrCountsResponse.parse(counts));
});

router.post("/dhikr/increment", async (req, res): Promise<void> => {
  const parsed = IncrementDhikrBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { dhikrKey } = parsed.data;

  if (!DHIKR_KEYS.includes(dhikrKey as DhikrKey)) {
    res.status(400).json({ error: "Invalid dhikrKey" });
    return;
  }

  const [existing] = await db
    .select()
    .from(dhikrCountsTable)
    .where(eq(dhikrCountsTable.dhikrKey, dhikrKey));

  if (existing) {
    await db
      .update(dhikrCountsTable)
      .set({ count: existing.count + 1 })
      .where(eq(dhikrCountsTable.dhikrKey, dhikrKey));
  } else {
    await db.insert(dhikrCountsTable).values({ dhikrKey, count: 1 });
  }

  const counts = await getAllCounts();
  res.json(IncrementDhikrResponse.parse(counts));
});

export default router;
