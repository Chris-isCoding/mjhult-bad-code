import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import mongoose from "mongoose";
import route from "./item.route.js";

const PUBLIC = path.resolve("frontend");
console.log(`Using "${PUBLIC}" as the public path.`);

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.static(path.resolve("frontend/")));

// Index
app.get("/", (req, res) => {
  res.status(200).sendFile(`${PUBLIC}/index.html`);
});

// Api route
app.use("/api/items", route);

// 404
app.use((req, res) => {});

// Error
app.use((err, req, res, next) => {});

mongoose.set("strictQuery", true);
mongoose
  .connect("mongodb://test:1234@127.0.0.1:27017/")
  .then(() => {
    console.log("Connected to database ✅");
    app.listen(3000, () =>
      console.log("Listening at http://localhost:3000/ ✅")
    );
  })
  .catch((e) => console.log(`🛑 An error occured 🛑\nError: ${e}`));
