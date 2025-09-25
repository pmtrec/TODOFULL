import express from "express";
import RouteFadilDev from "./routes/RouteFadilDev.js";
import AuthUserFadilD from "./routes/AuthUserFadilD.js";
import chatRoutes from "./routes/chatRoutes.js";
import cors from "cors";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

console.log("Starting server...");

const app = express();
const port = 4000;

// 🔹 ESModules n'ont pas __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🔹 Middleware
app.use(cors());
app.use(express.json());

// 🔹 Rendre le dossier uploads public
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 🔹 Multer pour vocaux
const storage = multer.diskStorage({
  destination: path.join(__dirname, "uploads"),
  filename: (_req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// 🔹 Route upload vocal
app.post("/upload-vocal", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "Aucun fichier reçu" });

  console.log("✅ Fichier reçu:", req.file);
  return res.json({
    message: "Upload OK",
    path: `/uploads/${req.file.filename}`,
  });
});

// 🔹 Routes existantes
app.use("/api/tasks", RouteFadilDev);
app.use("/api/auth", AuthUserFadilD);
app.use("/api/chat", chatRoutes);

// 🔹 Lancer serveur
app.listen(port, () => {
  console.log(`🚀 Serveur lancé : http://localhost:${port}/`);
});
