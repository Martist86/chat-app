const mongoose = require ('mongoose');
const Schema = mongoose.Schema;
const MessageSchema = new Schema({
    message: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    authorName: {
        type: String,
        required: true
    },
    time : { type : Date, default: Date.now }
});

module.exports = mongoose.model('messages', MessageSchema);