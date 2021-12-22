import multer from "multer";

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!!process.env.dpDestinationUrl) cb(null, process.env.dpDestinationUrl);
  },
  filename: (req, file, cb) => {
    const file_name = Date.now() + " " + file.originalname;
    cb(null, file_name);
  },
});

export const upload = multer({ storage: fileStorage });
