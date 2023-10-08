import { UploadedFile } from "express-fileupload";
import { Request, Response, NextFunction } from "express-serve-static-core";
import { sendError } from "../utils";

export const checkFileType = (fileType: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    let file: UploadedFile | UploadedFile[];

    if (!req.files || Object.keys(req.files).length === 0) {
      return next();
    } else {
      file = req.files[fileType];

      if (Array.isArray(file)) {
        for (let i = 0; i < file.length; i++) {
          let singleFile = file[i];
          if (!["image/png", "image/jpeg"].includes(singleFile.mimetype)) {
            return sendError(
              res,
              400,
              "Invalid file type. Only .jpg .png images are allowed"
            );
          }
        }
      } else {
        if (!["image/png", "image/jpeg"].includes(file.mimetype)) {
          return sendError(
            res,
            400,
            "Invalid file type. Only .jpg .png images are allowed"
          );
        }
      }
      next();
    }
  };
};
