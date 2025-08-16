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
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Get query params 'path' and 'id'
    const folderPath = req.query.path; // e.g. "current-affairs" or "pre/math"
    const fileId = req.query.id; // e.g. "1749150942013-285.jpg"
    if (!folderPath || !fileId) {
        return res.status(400).json({ error: "'path' and 'id' query parameters are required" });
    }
    // Construct full file path
    const filePath = path_1.default.join(__dirname, "..", "..", "uploads", folderPath, fileId);
    // Check if file exists
    if (!fs_1.default.existsSync(filePath)) {
        return res.status(404).json({ error: "File not found" });
    }
    console.log(filePath);
    // Send the file
    res.sendFile(filePath);
}));
exports.default = router;
