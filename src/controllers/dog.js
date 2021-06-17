import fs from "fs";
import path from "path";

import { downloadFromUrl, getTensorImage } from "../lib/image";
import { loadModel } from "../lib/ml";
import { getRankArray } from "../lib/array";

const makePrediction = async (req, res, next) => {
  const filePath = await downloadFromUrl(req.query.url);

  //모델 가져옴
  const model = await loadModel(
    "file://C:/Users/HERO/Desktop/kim/face-classification-server/tipa_resnet_js.h5/model.json"
  );

  //이미지 전처리 (이미지를 텐서로 변환)
  let tfImage = getTensorImage(filePath);
  tfImage = tfImage.reverse(-1).reshape([1, 224, 224, 3]).div(255);

  //예측하기 - 텐서를 리턴
  const result = model.predict(tfImage);

  //텐서를 어레이로 변환
  const resultArr = await result.arraySync();
  const rankArr = getRankArray(resultArr[0], 5);
  console.log(rankArr);

  //예측이 끝났으니 해당 이미지 삭제
  fs.unlinkSync(filePath);
  return res.json({ seq: rankArr });
};

export { makePrediction };
