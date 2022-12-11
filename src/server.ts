import express, { Request, Response, NextFunction } from "express";
import db from "./config/database.config";

import logger from "morgan";
import cookieParser from "cookie-parser";
import userRouter from "./routes/users";

db.sync({ force: true }).then(() => {
  console.log("connected to db");
});

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/users", userRouter);

const port = 9000;

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
