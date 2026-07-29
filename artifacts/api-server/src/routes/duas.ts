import { Router, type IRouter } from "express";
import { desc } from "drizzle-orm";
import { db, duasTable } from "@workspace/db";
import {
  SubmitDuaBody,
  GetDuasResponse,
  SubmitDuaResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/duas", async (_req, res): Promise<void> => {
  const duas = await db
    .select()
    .from(duasTable)
    .orderBy(desc(duasTable.createdAt))
    .limit(50);

  res.json(
    GetDuasResponse.parse(
      duas.map((d) => ({
        id: d.id,
        text: d.text,
        createdAt: d.createdAt.toISOString(),
      }))
    )
  );
});

router.post("/duas", async (req, res): Promise<void> => {
  const parsed = SubmitDuaBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  if (!parsed.data.text || parsed.data.text.trim().length === 0) {
    res.status(400).json({ error: "Dua text is required" });
    return;
  }

  const [dua] = await db
    .insert(duasTable)
    .values({ text: parsed.data.text.trim() })
    .returning();

  res.status(201).json(
    SubmitDuaResponse.parse({
      id: dua.id,
      text: dua.text,
      createdAt: dua.createdAt.toISOString(),
    })
  );
});

export default router;
