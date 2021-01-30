const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let guildSchema = new Schema({
  _id: { type: String, required: true },
  cmdblock: {
    channels: { type: Array, default: [] },
    enable: { type: Array, default: [] },
    status: { type: Boolean, default: false },
  },
});

let Guild = mongoose.model("Guilds", guildSchema);
module.exports = Guild;
