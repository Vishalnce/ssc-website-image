import { Router, Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import mime from "mime-types";

// Declare module augmentation for Express Request within this file
declare module "express" {
  interface Request {
    uploadedFileId?: string; // Make it optional in case it's not always set
  }
}

const router = Router();

// Define the target folders for random distribution
const targetFolders = ["I1", "I2", "I3", "I4"];

const storage = multer.diskStorage({
  destination: (req: Request, file, cb) => {
    // Randomly select one of the target folders
    const randomFolder = targetFolders[Math.floor(Math.random() * targetFolders.length)];
    
    // Construct the full path to the chosen folder
    const fullDir = path.join(__dirname, "..", "..", "uploads", randomFolder);
    console.log(`Saving to: ${fullDir}`);

    // Store the random folder name in the request for later use in the response
    // We can't directly modify req.body or req.file to add this easily without
    // type issues unless we augment Request further, so let's use res.locals
    // or pass it through a closure if needed for other parts. For simplicity,
    // we'll recalculate or pass it implicitly in the route handler.

    // Ensure the directory exists
    fs.mkdirSync(fullDir, { recursive: true });

    cb(null, fullDir);
  },
  filename: (req: Request, file, cb) => {
    const id = `${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Detect extension from mime-type
    const ext = mime.extension(file.mimetype);

    if (!ext) {
      return cb(new Error("Unsupported file type"), "");
    }

    const finalFilename = `${id}.${ext}`;

    cb(null, finalFilename);
  },
});

const upload = multer({ storage });

router.post("/", upload.single("image"), async (req: Request, res: Response): Promise<void> => {
  try {
    const file = req.file;
    if (!file) {
      res.status(400).json({ error: "File upload failed" });
      return;
    }

    // Determine the folder the file was saved to.
    // Since we randomly selected it in 'destination', we need to re-derive it
    // or ensure it's passed. For now, we can extract it from the file.path.
    const uploadsPath = path.join(__dirname, "..", "..", "uploads");
    const relativeFilePath = path.relative(uploadsPath, file.path);
    const folder = relativeFilePath.split(path.sep)[0]; // Extracts 'I1', 'I2', etc.

    const fileName = file.filename;
    const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${folder}/${fileName}`;

    res.status(200).json({
      message: "File uploaded successfully",
      id: fileName,
      url: fileUrl,
      folder: folder // Optionally return the folder it was saved to
    });
  } catch (error) {
    console.error("File upload error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;