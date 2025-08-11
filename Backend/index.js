import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { route } from './Routes/route.js';  // Your existing main routes
import 'dotenv/config';
import connectDB from './Db/index.js';

import paymentRoutes from './Routes/paymentRoutes.js';  // <-- Import payment routes

const server = express();
const PORT = process.env.PORT || 8000;

server.use(cors({
  origin: process.env.CORS_ORIGIN,  // string, e.g. "http://localhost:3000"
  credentials: true,
}));

server.use(cookieParser());
server.use(express.json({ limit: "16kb" }));
server.use(express.urlencoded({ extended: true }));

connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log("Server is running at " + PORT);
    });
  })
  .catch(error => {
    console.log("Error connecting::index.js", error);
  });

// Mount your existing routes
server.use("/api", route);

// Mount payment routes separately (important: mount BEFORE 404)
server.use('/api', paymentRoutes);

// Root route
server.get("/", (req, res) => {
  res.send("Hello to backend");
});

// 404 fallback
server.get('*', (req, res) => {
  res.status(404).send("404 NOT FOUND <a href='./'> Go To Home</a>");
});
