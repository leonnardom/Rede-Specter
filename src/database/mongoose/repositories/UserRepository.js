const MongoRepository = require("../MongoRepository.js");
const UserSchema = require("../schemas/UserSchema.js");

module.exports = class GuildRepository extends (
  MongoRepository
) {
  constructor(mongoose) {
    super(mongoose, mongoose.model("User", UserSchema));
  }

  parse(entity) {
    return {
      usedCommands: 0,
      ...(super.parse(entity) || {}),
    };
  }
};
