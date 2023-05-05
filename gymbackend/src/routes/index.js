const express = require('express');
const router = express.Router();
const { createExercise, getExerciseById ,getAllExercise,getAttributeData} = require('../controller');
const { postRating } = require('../controller/Rating');

router.post('/excercise', createExercise);
router.get('/excercise/:id', getExerciseById);
router.get('/getexcercise', getAllExercise);
router.get('/getAttributeData', getAttributeData);

router.post('/rating', postRating);
module.exports = router;