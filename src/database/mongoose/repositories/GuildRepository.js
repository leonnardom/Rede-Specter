const MongoRepository = require("../MongoRepository.js");
const GuildSchema = require("../schemas/GuildSchema.js");

module.exports = class GuildRepository extends (
  MongoRepository
) {
  constructor(mongoose) {
    super(mongoose, mongoose.model("Guild", GuildSchema));
  }

  parse(entity) {
    return {
      language: "pt-BR",
      prefix: "/",
      ...(super.parse(entity) || {}),
    };
  }
};
