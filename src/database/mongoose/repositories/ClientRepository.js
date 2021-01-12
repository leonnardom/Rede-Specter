const MongoRepository = require('../MongoRepository.js')
const ClientSchema = require('../schemas/ClientSchema.js')

module.exports = class ClientRepository extends MongoRepository {
    constructor(mongoose) {
        super(mongoose, mongoose.model('Client', ClientSchema))
    }

    parse(entity) {
        return {
            maintence: false,
            ...(super.parse(entity) || {})
        }
    }
}