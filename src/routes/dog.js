import express from "express";
import { makePrediction } from "../controllers/dog";

const router = express.Router();

router.route("/search").post(makePrediction);

export default router;
