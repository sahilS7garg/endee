const express = require('express');
const router = express.Router();
const { createProblem, getProblems, getProblemById, updateProblem, deleteProblem, submitProblem } = require('../controllers/problemController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getProblems);
router.get('/:id', getProblemById);
router.post('/:id/submit', protect, submitProblem);
router.post('/', protect, createProblem); // Admin-only in real prod, for now just protect
router.put('/:id', protect, updateProblem);
router.delete('/:id', protect, deleteProblem);

module.exports = router;
