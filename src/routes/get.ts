import { Router, Request, Response } from "express";
import path from "path";
import fs from "fs";

const router = Router();

router.get("/", async(req: Request, res: Response):Promise<any> => {
  // Get query params 'path' and 'id'
  const folderPath = req.query.path as string;  // e.g. "current-affairs" or "pre/math"
  const fileId = req.query.id as string;        // e.g. "1749150942013-285.jpg"

  if (!folderPath || !fileId) {
    return res.status(400).json({ error: "'path' and 'id' query parameters are required" });
  }

  // Construct full file path
  const filePath = path.join(__dirname, "..", "..", "uploads", folderPath, fileId);

  // Check if file exists
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "File not found" });
  }

  console.log(filePath)

  // Send the file
  res.sendFile(filePath);
});

export default router;
