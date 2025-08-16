import { Router, Request, Response } from "express";
import path from "path";
import fs from "fs";

const router = Router();

router.delete("/", async (req: Request, res: Response): Promise<any> => {
  const imageUrl = req.query.url as string;

  if (!imageUrl) {
    return res.status(400).json({ error: "'url' query parameter is required" });
  }

  try {
    // Parse the URL to extract the file path relative to your server root
    const parsedUrl = new URL(imageUrl);
    const pathname = parsedUrl.pathname; // e.g. /uploads/I1/1755190947709-946.jpg

    // Ensure the pathname contains /uploads/
    const uploadsIndex = pathname.indexOf("/uploads/");
    if (uploadsIndex === -1) {
      return res.status(400).json({ error: "Invalid image URL, missing /uploads/ path" });
    }

    // Get relative path by removing leading slash
    const relativeFilePath = pathname.startsWith("/") ? pathname.substr(1) : pathname;

    // Construct the absolute file path on the server
    const filePath = path.join(__dirname, "..", "..", relativeFilePath);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "File not found" });
    }

    // Delete the file
    fs.unlinkSync(filePath);
    console.log(`file deleted${filePath}`)
    return res.status(200).json({ message: "File deleted", path: relativeFilePath });
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete file", details: error });
  }
});

export default router;
