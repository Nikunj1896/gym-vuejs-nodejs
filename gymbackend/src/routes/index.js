const express = require('express');
const router = express.Router();
const { createExercise, getExerciseById ,getAllExercise,getAttributeData} = require('../controller');

router.post('/excercise', createExercise);
router.get('/excercise/:id', getExerciseById);
router.get('/getexcercise', getAllExercise);
router.get('/getAttributeData', getAttributeData);
module.exports = router;