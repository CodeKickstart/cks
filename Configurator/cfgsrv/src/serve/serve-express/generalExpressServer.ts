import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import { fnHandlePostData, fnHandleFetchQuery } from "../expressHandlers";

dotenv.config();

const fnSetupExpress = (expressPort: string | undefined) => {
  const app = express();
  const server = http.createServer(app);

  // Enable CORS for all routes
  app.use(
    cors({
      origin: process.env.CLIENT_ORIGIN,
      credentials: true,
    })
  );

  const client_origin = ["http://localhost:3502/"];
  const io = new Server(server, {
    cors: {
      origin: client_origin, // Adjust the origin as needed
      methods: ["GET", "POST"],
    },
  });

  console.log(`Client origin: ${client_origin}`);

  app.get("/api/queryDataSrc", fnHandleFetchQuery);

  app.use(express.json());
  app.post("/api/queryDataSrc", fnHandlePostData);

  app.listen(expressPort, () => {
    console.log(`Express Server is running on port ${expressPort}`);
  });

  return { app, server, io };
};

export default fnSetupExpress;
