const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let userSchema = new Schema({
  _id: { type: String },
  // ------------------> Economy <-----------------------
  coins: { type: Number, default: 0 },
  daily: { type: String },
  bank: { type: Number, default: 0 },
  // ------------------> Steal <-----------------------
  steal: { type: String },
  // ------------------> Work <-----------------------
  work: {
    name: { type: String, default: "Não definido" },
    exp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    nextLevel: { type: Number, default: 50 },
    cooldown: { type: Number, default: 0 },
    money: { type: Number, default: 100 },
    works: {
      lixeiro: {
        name: { type: String, default: "Lixeiro" },
        level: { type: Number, default: 0 },
        coins: { type: Number, default: 0 },
        active: { type: Boolean, default: false },
      },
      Empacotador: {
        name: { type: String, default: "Empacotador" },
        level: { type: Number, default: 0 },
        coins: { type: Number, default: 0 },
        active: { type: Boolean, default: false },
      },
      iFood: {
        name: { type: String, default: "iFood" },
        level: { type: Number, default: 0 },
        coins: { type: Number, default: 0 },
        active: { type: Boolean, default: false },
      },
      Administração: {
        name: { type: String, default: "Administração" },
        level: { type: Number, default: 0 },
        coins: { type: Number, default: 0 },
        active: { type: Boolean, default: false },
      },
      Policial: {
        name: { type: String, default: "Policial" },
        level: { type: Number, default: 0 },
        coins: { type: Number, default: 0 },
        active: { type: Boolean, default: false },
      },
      Advogado: {
        name: { type: String, default: "Advogado" },
        level: { type: Number, default: 0 },
        coins: { type: Number, default: 0 },
        active: { type: Boolean, default: false },
      },
      Engenheiro: {
        name: { type: String, default: "Engenheiro" },
        level: { type: Number, default: 0 },
        coins: { type: Number, default: 0 },
        active: { type: Boolean, default: false },
      },
      Progamador: {
        name: { type: String, default: "Progamador" },
        level: { type: Number, default: 0 },
        coins: { type: Number, default: 0 },
        active: { type: Boolean, default: false },
      },
      Médico: {
        name: { type: String, default: "Médico" },
        level: { type: Number, default: 0 },
        coins: { type: Number, default: 0 },
        active: { type: Boolean, default: false },
      },
    },
  },
});

const User = mongoose.model("Users", userSchema);
module.exports = User;
