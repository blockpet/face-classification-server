import { downloadFromUrl } from "../lib/image";
import { dogClassify } from "../lib/ml";

const search = async (req, res, next) => {
  const filePath = await downloadFromUrl(req.query.url);

  const result = await dogClassify(filePath, 5);

  return res.json({ result });
};

const identify = async (req, res, next) => {
  const filePath = await downloadFromUrl(req.query.url);

  const rankArray = await dogClassify(filePath, 1);

  const result = rankArray[0].mlKey == req.query.mlKey;

  console.log(result);

  return res.json({ result });
};

export { search, identify };
