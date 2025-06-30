import path from "path";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const ext = path.extname(file.originalname).slice(1);
    return {
      folder: "items",
      format: ext,
      public_id: `${Date.now()}-${path.basename(
        file.originalname,
        path.extname(file.originalname)
      )}`,
    };
  },
});

export const upload = multer({ storage });
