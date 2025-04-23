const { Schema, model } = require('mongoose');

const JobSchema = Schema({
    date: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    
    status: {
        type: String,
        enum: ['applied', 'interview', 'offer', 'rejected'],
        required: true
    },
    notes: {
        type: String
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }
});

JobSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});

module.exports = model('Job', JobSchema);
