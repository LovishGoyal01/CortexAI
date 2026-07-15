import express from "express";
import dotenv from "dotenv";
import proxy from "express-http-proxy";
dotenv.config();  //dotenv.config(); loads the variables from your .env file into process.env
import cors from "cors";
import cookieParser from "cookie-parser";
import { getCurrentUser } from "./controllers/user.controller.js";
import protect from "./middleware/auth.middleware.js";
import { proxyWithHeader } from "./utils/proxyWithHeader.js";
import morgan from "morgan";

const port = process.env.PORT;
const app = express();
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}))

app.use(morgan("dev")) // help to see which api hits

app.use(cookieParser()); 

app.use("/api/auth", proxy(process.env.AUTH_SERVICE))     // in proxy that service is defined when we call /auth it will redirect to the auth service
app.use("/api/chat",protect, proxyWithHeader(process.env.CHAT_SERVICE)) 
app.use("/api/agent",protect, proxy(process.env.AGENT_SERVICE)) 
app.get("/api/me", protect, getCurrentUser);  // this route is protected by the auth middleware)

app.get("/", (req, res) => {
  res.json({ message: "Gateway server is running" });
});

app.listen(port, () => {
  console.log(`Gateway server is running on port ${port}`);
})