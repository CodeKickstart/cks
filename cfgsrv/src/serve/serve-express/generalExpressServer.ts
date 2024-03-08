import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import { fnPostData, handleFetchQuery } from "../expressHandlers";

dotenv.config();

const fnSetupExpress = (expressPort: string | undefined) => {
  const app = express();
  const server = http.createServer(app);

  // Enable CORS for all routes
  app.use(cors());

  const client_origin = process.env.CLIENT_ORIGIN;
  const io = new Server(server, {
    cors: {
      origin: client_origin, // Adjust the origin as needed
      methods: ["GET", "POST"],
    },
  });

  console.log(`Client origin: ${client_origin}`);

  app.get("/api/queryDataSrc", handleFetchQuery);

  app.post("/api/data", fnPostData);

  app.listen(expressPort, () => {
    console.log(`Express Server is running on port ${expressPort}`);
  });

  return { app, server, io };
};

export default fnSetupExpress;
