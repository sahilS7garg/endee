const User = require('../models/User');
const Problem = require('../models/Problem');
const mlService = require('../utils/mlService');

exports.getUserProgress = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('solvedProblems accuracy streak topicMastery');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getRecommendations = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const userData = {
            solved_ids: user.solvedProblems,
            topics: user.topicMastery
        };

        const recommendations = await mlService.getRecommendations(userData);
        
        // Fetch full problem details for the recommended IDs
        const recommendedIds = recommendations.map(r => r.id);
        const problems = await Problem.find({ _id: { $in: recommendedIds } })
            .select('title difficulty topic');

        res.json(problems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
