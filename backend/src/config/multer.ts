import multer from "multer";
import { ArquivoInvalidoError } from "../exceptions/ConteudoErrors.js";

const uploadConfig: multer.Options = {
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      // ArquivoInvalidoError tem statusCode 400, então o errorHandler responde 400
      cb(new ArquivoInvalidoError());
    }
  },
};

export default uploadConfig;
