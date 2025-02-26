import express from "express";
import cors from "cors";
import authRouter from "./routes/authRouter";

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/auth", authRouter);

app.listen(8081, () => {
  console.log("Server is running on port 8081");
});
