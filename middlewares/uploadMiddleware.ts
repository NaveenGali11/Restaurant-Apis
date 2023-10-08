import { NextFunction, Request, Response } from "express-serve-static-core";
import { UploadedFile } from "express-fileupload";

export const uploadMiddleware = (
  fileType: string,
  path: string = "uploads/"
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    let images: UploadedFile | UploadedFile[];
    if (!req.files || Object.keys(req.files).length === 0) {
      return next();
    } else {
      let imagesPaths: string[] = [];
      images = req.files[fileType];

      if (Array.isArray(images)) {
        for (let i = 0; i < images.length; i++) {
          let image = images[i];
          const uniqueFileName = await moveFile(image, path);

          imagesPaths.push(path + uniqueFileName);
        }
        req.body[fileType] = imagesPaths;
      } else {
        const uniqueFileName = await moveFile(images, path);
        req.body[fileType] = path + uniqueFileName;
      }

      next();
    }
  };
};

const moveFile = async (file: UploadedFile, path: string) => {
  let fileName = file.name;

  fileName = fileName.replace(/[^a-zA-Z0-9.]/g, "_").replace(/[\(\)]/g, "");
  const uniqueFilename = Date.now() + "-" + fileName;

  await file.mv("./" + path + uniqueFilename);

  return uniqueFilename;
};
