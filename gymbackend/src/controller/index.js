const Excercise = require("../model/Excercise");

const createExercise = async (req, res) => {
    try {
        const { Category, Difficulty, Force, Grips, details, exercise_name, steps, target, videoURL, youtubeURL } = req.body;
        const exercise = new Excercise({ Category, Difficulty, Force, Grips, details, exercise_name, steps, target, videoURL, youtubeURL });
        const newExercise = await exercise.save();
        res.status(201).json(newExercise);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
}

const getAllExercise = async (req, res) => {
    try {
        const excercise = await Excercise.find();
        res.json(excercise)
    } catch (err) {
        res.status(400).json({ messgae: "Bad request" })
    }
}
const getExerciseById = async (req, res) => {
    try {
        const id = req.params.id
        if (!id) {
            res.status(500).json({ message: "id is not provided" })
        } else {
            const excercise = await Excercise.findById(id);
            res.status(200).json({ message: excercise })
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
}

const getAttributeData = async (req, res) => {
    // {Category :"Barbell"}  Dumbbells
    // let filter = {
    //     ...(Category &&  {Category: { $in: categories }}),
    //     ...(Difficulty &&  {Difficulty: { $in: difficulties }}),
    //     ...(Force &&  {Force: { $in: forces }})
    // }
    try {
        const data = await Excercise.aggregate(
            [{
                $match: {
                    Category: {
                        $in: dd
                    }
                }
            }]
        )
        console.log("qwqqq--------", data);
        res.json({ message: data })
    } catch (err) {
        res.json(err)
        console.log(("errrr==============", err));
    }

}
module.exports = {
    createExercise,
    getExerciseById,
    getAllExercise,
    getAttributeData
}