import express from "express";
import dog from "./dog";

const router = express.Router();

router.use("/dog", dog);

export default router;
