const express = require('express');
const router = express.Router();
const { createExercise, getExerciseById ,getAllExercise,getAttributeData} = require('../controller');
const { postRating, addRating, addTestRating } = require('../controller/Rating');

router.post('/excercise', createExercise);
router.get('/excercise/:id', getExerciseById);
router.get('/getexcercise', getAllExercise);
router.get('/getAttributeData', getAttributeData);

router.post('/rating', postRating);
router.get('/addRating',  addRating);
router.post('/addTestRating', addTestRating);

module.exports = router;