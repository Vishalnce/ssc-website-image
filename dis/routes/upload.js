"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const mime_types_1 = __importDefault(require("mime-types"));
const router = (0, express_1.Router)();
// Define the target folders for random distribution
const targetFolders = ["I1", "I2", "I3", "I4"];
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        // Randomly select one of the target folders
        const randomFolder = targetFolders[Math.floor(Math.random() * targetFolders.length)];
        // Construct the full path to the chosen folder
        const fullDir = path_1.default.join(__dirname, "..", "..", "uploads", randomFolder);
        console.log(`Saving to: ${fullDir}`);
        // Store the random folder name in the request for later use in the response
        // We can't directly modify req.body or req.file to add this easily without
        // type issues unless we augment Request further, so let's use res.locals
        // or pass it through a closure if needed for other parts. For simplicity,
        // we'll recalculate or pass it implicitly in the route handler.
        // Ensure the directory exists
        fs_1.default.mkdirSync(fullDir, { recursive: true });
        cb(null, fullDir);
    },
    filename: (req, file, cb) => {
        const id = `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        // Detect extension from mime-type
        const ext = mime_types_1.default.extension(file.mimetype);
        if (!ext) {
            return cb(new Error("Unsupported file type"), "");
        }
        const finalFilename = `${id}.${ext}`;
        cb(null, finalFilename);
    },
});
const upload = (0, multer_1.default)({ storage });
router.post("/", upload.single("image"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const file = req.file;
        if (!file) {
            res.status(400).json({ error: "File upload failed" });
            return;
        }
        // Determine the folder the file was saved to.
        // Since we randomly selected it in 'destination', we need to re-derive it
        // or ensure it's passed. For now, we can extract it from the file.path.
        const uploadsPath = path_1.default.join(__dirname, "..", "..", "uploads");
        const relativeFilePath = path_1.default.relative(uploadsPath, file.path);
        const folder = relativeFilePath.split(path_1.default.sep)[0]; // Extracts 'I1', 'I2', etc.
        const fileName = file.filename;
        const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${folder}/${fileName}`;
        res.status(200).json({
            message: "File uploaded successfully",
            id: fileName,
            url: fileUrl,
            folder: folder // Optionally return the folder it was saved to
        });
    }
    catch (error) {
        console.error("File upload error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}));
exports.default = router;
