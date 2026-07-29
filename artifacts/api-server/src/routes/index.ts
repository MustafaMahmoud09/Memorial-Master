import { Router, type IRouter } from "express";
import healthRouter from "./health";
import statsRouter from "./stats";
import dhikrRouter from "./dhikr";
import duasRouter from "./duas";

const router: IRouter = Router();

router.use(healthRouter);
router.use(statsRouter);
router.use(dhikrRouter);
router.use(duasRouter);

export default router;
