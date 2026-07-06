import dotenv from "dotenv";
dotenv.config();

import connectDB from "./config/db.js";
import { server } from "./socket/socket.js";

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  });