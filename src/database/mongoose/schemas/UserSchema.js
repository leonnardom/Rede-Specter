const { Schema } = require("mongoose");

const ContributorSettings = {
  redirect: "None",
  owner: false,
  gerente: false,
  coordenador: false,
  suporte: false,
  developer: false,
  designer: false,
  translater: false,
};


module.exports = new Schema({
  _id: {
    type: String,
  },
  contributor: {
    type: Object,
    default: ContributorSettings,
  },
  usedCommands: {
    type: Number,
    default: 0,
  },
});
