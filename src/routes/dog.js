import express from "express";
import { search, identify } from "../controllers/dog";

const router = express.Router();

router.route("/search").post(search);
router.route("/identify").post(identify);

export default router;
