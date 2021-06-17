import fs from "fs";
import * as tfnode from "@tensorflow/tfjs-node";

const loadModel = async (url) => {
  return await tfnode.loadLayersModel(url);
};

export { loadModel };
