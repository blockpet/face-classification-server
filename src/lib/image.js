import multer from "multer";
import fs from "fs";
import path from "path";
import fetch from "node-fetch";
import * as tfnode from "@tensorflow/tfjs-node";

const getUploadObject = () => {
  const storage = multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, "images");
    },
    filename: (req, file, callback) => {
      callback(null, "test-image.jpg");
    },
  });
  const imageFileFilter = (req, file, callback) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return callback(new Error("You can upload only image files"), false);
    }
    callback(null, true);
  };
  return multer({ storage, fileFilter: imageFileFilter });
};

const getTensorImage = (path) => {
  const imageBuffer = fs.readFileSync(path);
  return tfnode.node.decodeImage(imageBuffer);
};

const downloadFromUrl = async (url) => {
  const response = await fetch(url);
  const buffer = await response.buffer();
  const filePath = path.join("./images", path.basename(url));
  fs.writeFileSync(filePath, buffer);
  return filePath;
};

export { getUploadObject, getTensorImage, downloadFromUrl };
