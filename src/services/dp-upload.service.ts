import multer from "multer";

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "C:/Users/pranusha.sivasamy/Documents/GitHub/convozone-backend/src/assets");
    },
    filename: (req, file, cb) => {
      const file_name = Date.now() + " "+ file.originalname;
      cb(null, file_name);
    },
  });
  
 export const upload = multer({ storage: fileStorage });