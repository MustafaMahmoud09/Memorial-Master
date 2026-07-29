import { Router, type IRouter } from "express";
import { count, countDistinct } from "drizzle-orm";
import { db, duasTable, dhikrCountsTable, visitorsTable } from "@workspace/db";
import {
  RecordVisitBody,
  GetStatsResponse,
  RecordVisitResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

async function buildStats() {
  const [visitorResult] = await db
    .select({ total: count() })
    .from(visitorsTable);

  const [duaResult] = await db
    .select({ total: count() })
    .from(duasTable);

  const dhikrRows = await db.select().from(dhikrCountsTable);

  let totalDhikr = 0;
  let totalIstighfar = 0;
  let totalSalawat = 0;
  let mostUsedDhikr = "";
  let maxCount = 0;

  for (const row of dhikrRows) {
    totalDhikr += row.count;
    if (row.dhikrKey === "Astaghfirullah") totalIstighfar = row.count;
    if (row.dhikrKey === "Salawat") totalSalawat = row.count;
    if (row.count > maxCount) {
      maxCount = row.count;
      mostUsedDhikr = row.dhikrKey;
    }
  }

  const countryRows = await db
    .selectDistinct({ country: visitorsTable.country })
    .from(visitorsTable);

  const countries = countryRows
    .map((r) => r.country)
    .filter((c): c is string => c !== null);

  return {
    totalVisitors: visitorResult?.total ?? 0,
    totalDuas: duaResult?.total ?? 0,
    totalDhikr,
    totalIstighfar,
    totalSalawat,
    mostUsedDhikr,
    countries,
  };
}

router.get("/stats", async (_req, res): Promise<void> => {
  const stats = await buildStats();
  res.json(GetStatsResponse.parse(stats));
});

router.post("/stats/visit", async (req, res): Promise<void> => {
  const parsed = RecordVisitBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  await db.insert(visitorsTable).values({
    country: parsed.data.country ?? null,
  });

  const stats = await buildStats();
  res.json(RecordVisitResponse.parse(stats));
});

export default router;
