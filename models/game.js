const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate-v2");

const questionSchema = new Schema(
  {
    points: { type: Number, required: true, enum: [200, 400, 600, 800, 1000] },
    body: { type: String, required: true },
    answer: { type: String, required: true },
  },
  { _id: false }
);

const categorySchema = new Schema(
  { name: { type: String, required: true }, questions: [questionSchema] },
  { _id: false }
);

const gameSchema = new Schema({
  title: { type: String, required: true },
  access: { type: String, required: true, enum: ["public", "private"] },
  categories: [categorySchema],
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

gameSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Game", gameSchema);
