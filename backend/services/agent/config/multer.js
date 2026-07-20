import fs from "fs";
import multer from "multer";
import path from "path";

const uploadDir = path.resolve("./temp");  // here multer will store the things temporarily before sending to the agent

if(!fs.existsSync(uploadDir)){  // if temp folder does not exist then create it
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);    
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);  // to avoid name conflicts
    }
})        

const fileFilter = (req, file, cb) => {
   if(file.mimetype === "application/pdf" || file.mimetype.startsWith("image/")){
      cb(null, true);  // accept the file   
   } else {
        cb(new Error("Only PDF and image files are allowed"), false);  // reject the file
   }
}

export default multer({ storage, fileFilter, limits: { fileSize: 10 * 1024 * 1024 } });