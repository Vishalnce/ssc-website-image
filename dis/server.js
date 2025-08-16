"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/server.ts
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const upload_1 = __importDefault(require("./routes/upload"));
const get_1 = __importDefault(require("./routes/get"));
const delete_1 = __importDefault(require("./routes/delete"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Middleware
app.use((0, cors_1.default)({ origin: true }));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Serve static image files
app.use("/uploads", express_1.default.static(path_1.default.join(__dirname, "..", "uploads")));
// Mount your upload route
app.use("/api/upload", upload_1.default);
app.use("/api/image", get_1.default);
app.use("/api/delete", delete_1.default);
// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
