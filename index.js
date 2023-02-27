import express from "express";
import cors from "cors";
import morgan from "morgan";
import User from "./routes/User.js";
const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: "true" }));
app.use(morgan("tiny"));
app.use("/user", User);

const PORT = 5000 || process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
