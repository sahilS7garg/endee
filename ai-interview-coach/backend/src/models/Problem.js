const mongoose = require('mongoose');

const ProblemSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
    topic: { type: String, required: true },
    constraints: [String],
    examples: [{
        input: String,
        output: String,
        explanation: String
    }],
    testCases: [{
        input: String,
        expectedOutput: String,
        isPublic: { type: Boolean, default: false }
    }]
}, { timestamps: true });

module.exports = mongoose.model('Problem', ProblemSchema);
