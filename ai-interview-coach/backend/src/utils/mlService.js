const axios = require('axios');

const ML_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

exports.predictDifficulty = async (description, constraintsCount, exampleCount) => {
    try {
        const response = await axios.post(`${ML_SERVICE_URL}/predict_difficulty`, {
            description,
            constraints_count: constraintsCount,
            example_count: exampleCount
        });
        return response.data.difficulty;
    } catch (error) {
        console.error('Error calling ML service for difficulty:', error.message);
        return 'Medium'; // Fallback
    }
};

exports.getRecommendations = async (userData) => {
    try {
        const response = await axios.post(`${ML_SERVICE_URL}/recommend_problems`, userData);
        return response.data.recommendations;
    } catch (error) {
        console.error('Error calling ML service for recommendations:', error.message);
        return [];
    }
};
