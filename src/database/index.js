const mongoose = require("mongoose");

module.exports = {
  start() {
    try {
      mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      });

      console.log(`(DATABASE) - Conectado com Sucesso ao Banco de Dados.`);
    } catch (err) {
      if (err) return console.log(`(DATABASE) - ERROR: ${err}`);
    }
  },
};
