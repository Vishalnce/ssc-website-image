// src/server.ts
import express from "express";

import path from "path";
import uploadRoute from './routes/upload'; 
import imageRoute from './routes/get'; 
import deleteRoute from "./routes/delete"
import cors from "cors"


const app = express();
const PORT = process.env.PORT || 5000;

// Middleware

app.use(cors({ origin: true }));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// Serve static image files
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

// Mount your upload route
app.use("/api/upload", uploadRoute);

app.use("/api/image", imageRoute);

app.use("/api/delete",deleteRoute)

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
