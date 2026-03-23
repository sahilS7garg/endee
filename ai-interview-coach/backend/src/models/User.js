const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    solvedProblems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Problem' }],
    accuracy: { type: Number, default: 0 },
    streak: { type: Number, default: 0 },
    lastSolved: { type: Date },
    topicMastery: {
        type: Map,
        of: Number,
        default: {
            'arrays': 0,
            'graphs': 0,
            'dynamic programming': 0,
            'strings': 0,
            'trees': 0,
            'greedy': 0
        }
    }
}, { timestamps: true });

UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

UserSchema.methods.comparePassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
