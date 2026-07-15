import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import router from "./routes/auth.route.js";
dotenv.config();  //dotenv.config(); loads the variables from your .env file into process.env

const port = process.env.PORT;
const app = express();
app.use(express.json()); 
app.use("/",router);

app.get("/", (req, res) => {
  res.json({ message: "Auth server is running" });
});

app.listen(port, () => {
  console.log(`Auth server is running on port ${port}`);
  connectDB();
})