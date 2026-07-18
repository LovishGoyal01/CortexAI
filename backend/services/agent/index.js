import dotenv from "dotenv";
dotenv.config();  //dotenv.config(); loads the variables from your .env file into process.env

import express from "express";
import connectDB from "./config/db.js";
import router from "./routes/agent.route.js"; 


const port = process.env.PORT;
const app = express();
app.use(express.json()); 

app.use("/",router);
app.get("/", (req, res) => {
  res.json({ message: "Agent server is running" });
});

app.listen(port, () => {
  console.log(`Agent server is running on port ${port}`);
  connectDB();
})