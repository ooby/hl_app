const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const imageSchema = new Schema({
    _account: { type: Schema.Types.ObjectId, ref: 'Account', required: true },
    uuid: { type: String, required: true, unique: true },
    type: { type: String, default: 'DICOM' },
    name: { type: String, required: true },
    description: { type: String, default: 'default description' },
    path: { type: String, required: true },
    created: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Image', imageSchema);