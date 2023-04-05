import express from "express";
import cors from "cors";

const app = express();

// Settings
app.set("port", process.env.PORT || 3000);

// Middlewares
app.use(express.json());
app.use(cors());

// Routes

export { app };
