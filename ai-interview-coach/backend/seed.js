const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Problem = require('./src/models/Problem');

dotenv.config();

const problems = [
  {
    title: "Two Sum",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    difficulty: "Easy",
    topic: "Arrays",
    constraints: ["2 <= nums.length <= 10^4", "-10^9 <= nums[i] <= 10^9", "-10^9 <= target <= 10^9"],
    examples: [{ input: "nums = [2,7,11,15], target = 9", output: "[0,1]", explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]." }]
  },
  {
    title: "Add Two Numbers",
    description: "You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.",
    difficulty: "Medium",
    topic: "Linked List",
    constraints: ["The number of nodes in each linked list is in the range [1, 100].", "0 <= Node.val <= 9"],
    examples: [{ input: "l1 = [2,4,3], l2 = [5,6,4]", output: "[7,0,8]", explanation: "342 + 465 = 807." }]
  },
  {
    title: "Longest Substring Without Repeating Characters",
    description: "Given a string s, find the length of the longest substring without repeating characters.",
    difficulty: "Medium",
    topic: "String",
    constraints: ["0 <= s.length <= 5 * 10^4", "s consists of English letters, digits, symbols and spaces."],
    examples: [{ input: "s = \"abcabcbb\"", output: "3", explanation: "The answer is \"abc\", with the length of 3." }]
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding...');
    await Problem.deleteMany({});
    await Problem.insertMany(problems);
    console.log('Database seeded successfully!');
    process.exit();
  } catch (err) {
    console.error('Seeding error:', err.message);
    process.exit(1);
  }
};

seedDB();
