const uuidv4 = require('uuid/v4') // make random uuid

module.exports.genUuid = () => {
    return uuidv4()
}
