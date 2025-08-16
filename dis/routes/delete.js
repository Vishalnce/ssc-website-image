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
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const router = (0, express_1.Router)();
router.delete("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const imageUrl = req.query.url;
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
        const filePath = path_1.default.join(__dirname, "..", "..", relativeFilePath);
        // Check if file exists
        if (!fs_1.default.existsSync(filePath)) {
            return res.status(404).json({ error: "File not found" });
        }
        // Delete the file
        fs_1.default.unlinkSync(filePath);
        console.log(`file deleted${filePath}`);
        return res.status(200).json({ message: "File deleted", path: relativeFilePath });
    }
    catch (error) {
        return res.status(500).json({ error: "Failed to delete file", details: error });
    }
}));
exports.default = router;
