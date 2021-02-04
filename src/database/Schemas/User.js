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
    register: { type: Boolean, default: false },
    exp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    nextLevel: { type: Number, default: 150 },
    cooldown: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    works: {
      Lixeiro: {
        name: { type: String, default: "Lixeiro" },
        level: { type: Number, default: 1 },
        coins: { type: Number, default: 100 },
        active: { type: Boolean, default: false },
      },
      Empacotador: {
        name: { type: String, default: "Empacotador" },
        level: { type: Number, default: 10 },
        coins: { type: Number, default: 200 },
        active: { type: Boolean, default: false },
      },
      iFood: {
        name: { type: String, default: "iFood" },
        level: { type: Number, default: 20 },
        coins: { type: Number, default: 300 },
        active: { type: Boolean, default: false },
      },
      Administracao: {
        name: { type: String, default: "Administração" },
        level: { type: Number, default: 30 },
        coins: { type: Number, default: 400 },
        active: { type: Boolean, default: false },
      },
      Policial: {
        name: { type: String, default: "Policial" },
        level: { type: Number, default: 40 },
        coins: { type: Number, default: 500 },
        active: { type: Boolean, default: false },
      },
      Advogado: {
        name: { type: String, default: "Advogado" },
        level: { type: Number, default: 50 },
        coins: { type: Number, default: 1000 },
        active: { type: Boolean, default: false },
      },
      Engenheiro: {
        name: { type: String, default: "Engenheiro" },
        level: { type: Number, default: 60 },
        coins: { type: Number, default: 1500 },
        active: { type: Boolean, default: false },
      },
      Progamador: {
        name: { type: String, default: "Progamador" },
        level: { type: Number, default: 70 },
        coins: { type: Number, default: 2000 },
        active: { type: Boolean, default: false },
      },
      Medico: {
        name: { type: String, default: "Médico" },
        level: { type: Number, default: 80 },
        coins: { type: Number, default: 2500 },
        active: { type: Boolean, default: false },
      },
    },
  },
});

const User = mongoose.model("Users", userSchema);
module.exports = User;
