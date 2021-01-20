const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let userSchema = new Schema({
  _id: { type: String },
  // ----------------------------------------- Economy
  coins: { type: Number, default: 0 },
  daily: { type: String },
  bank: { type: Number, default: 0 },
  // -----------------------------------------
});

const User = mongoose.model("Users", userSchema);
module.exports = User;
