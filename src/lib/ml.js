import fs from "fs";
import * as tfnode from "@tensorflow/tfjs-node";

import { getTensorImage } from "../lib/image";
import { getRankArray } from "../lib/array";

const loadModel = async (url) => {
  return await tfnode.loadLayersModel(url);
};

const dogClassify = async (imagePath, rank) => {
  //모델 가져옴
  const model = await loadModel(
    process.env.ROOT_PATH + "tipa_resnet_js.h5/model.json"
  );

  //이미지 전처리 (이미지를 텐서로 변환)
  let tfImage = getTensorImage(imagePath);
  tfImage = tfImage.reverse(-1).reshape([1, 224, 224, 3]).div(255);

  //예측하기 - 텐서를 리턴
  const result = model.predict(tfImage);

  //텐서를 어레이로 변환
  const resultArr = await result.arraySync();
  const rankArr = getRankArray(resultArr[0], rank);

  //예측이 끝났으니 해당 이미지 삭제
  fs.unlinkSync(imagePath);
  return rankArr;
};

export { loadModel, dogClassify };
