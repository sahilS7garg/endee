const Problem = require('../models/Problem');
const User = require('../models/User');
const mlService = require('../utils/mlService');

exports.createProblem = async (req, res) => {
    try {
        const { title, description, topic, constraints, examples, testCases, difficulty } = req.body;
        
        let predictedDifficulty = difficulty;
        if (!predictedDifficulty) {
            const constraintsCount = constraints ? constraints.length : 0;
            const exampleCount = examples ? examples.length : 0;
            predictedDifficulty = await mlService.predictDifficulty(description, constraintsCount, exampleCount);
        }

        const problem = await Problem.create({
            title,
            description,
            topic,
            constraints,
            examples,
            testCases,
            difficulty: predictedDifficulty || 'Medium'
        });
        res.status(201).json(problem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getProblems = async (req, res) => {
    try {
        const problems = await Problem.find().select('title difficulty topic');
        res.json(problems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getProblemById = async (req, res) => {
    try {
        const problem = await Problem.findById(req.params.id);
        if (problem) {
            res.json(problem);
        } else {
            res.status(404).json({ message: 'Problem not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateProblem = async (req, res) => {
    try {
        const problem = await Problem.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (problem) {
            res.json(problem);
        } else {
            res.status(404).json({ message: 'Problem not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteProblem = async (req, res) => {
    try {
        const problem = await Problem.findByIdAndDelete(req.params.id);
        if (problem) {
            res.json({ message: 'Problem deleted' });
        } else {
            res.status(404).json({ message: 'Problem not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.submitProblem = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const problem = await Problem.findById(req.params.id);
        
        if (!user || !problem) {
            return res.status(404).json({ message: 'User or Problem not found' });
        }

        if (!user.solvedProblems.includes(problem._id)) {
            user.solvedProblems.push(problem._id);
            
            // Update topic mastery
            const topic = problem.topic.toLowerCase();
            const currentMastery = user.topicMastery.get(topic) || 0;
            user.topicMastery.set(topic, currentMastery + 10); // Simple increment for now
            
            // Update streak and lastSolved
            const today = new Date().setHours(0, 0, 0, 0);
            const lastSolved = user.lastSolved ? new Date(user.lastSolved).setHours(0, 0, 0, 0) : null;
            
            if (lastSolved === today - 86400000) {
                user.streak += 1;
            } else if (lastSolved !== today) {
                user.streak = 1;
            }
            user.lastSolved = new Date();
            
            await user.save();
        }

        res.json({ message: 'Problem solved successfully', streak: user.streak });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
