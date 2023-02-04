import { Schema, model } from "mongoose";

const ItemSchema = new Schema({
  title: { type: String, required: true },
  desc: { type: String, default: "" },
});

export default model("Items", ItemSchema);
