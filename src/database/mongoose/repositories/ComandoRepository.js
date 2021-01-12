const MongoRepository = require('../MongoRepository.js')
const ComandoSchema = require('../schemas/ComandoSchema.js')

module.exports = class ComandoRepository extends MongoRepository {
    constructor(mongoose) {
        super(mongoose, mongoose.model('Comando', ComandoSchema))
    }

    parse(entity) {
        return {
            maintence: false,
            usages: 0,
            ...(super.parse(entity) || {})
        }
    }
}