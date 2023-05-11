const { default: axios } = require("axios");
const Excercise = require("../model/Excercise");

const ApiUrl = "https://musclewiki.p.rapidapi.com/exercises"
const options = {
    headers: {
        'X-RapidAPI-Key': 'efcf7f0320mshbc0050f3d148c15p1cb8c9jsn6b0c26f1c735',
        'X-RapidAPI-Host': 'musclewiki.p.rapidapi.com'
    }
};

const createExercise = async (req, res) => {
    try {
        const { Category, Difficulty, Force, Grips, details, exercise_name, steps, target, videoURL, youtubeURL, id } = req.body;
        const exercise = new Excercise({ id, Category, Difficulty, Force, Grips, details, exercise_name, steps, target, videoURL, youtubeURL });
        const newExercise = await exercise.save();
        res.status(200).json(newExercise);
    } catch (error) {
        res.status(500).json({ message: error });
    }
}

const getAllExercise = async (req, res) => {
    try {
        axios
            .get(ApiUrl, options)
            .then((response) => {
                res.status(200).send({ "data": response.data })
            }).catch((err) => { res.status(200).json({ messgae: `Error in fetching Data ${err}` }) })

    } catch (error) {
        res.status(400).json({ messgae: error })
    }
}
const getExerciseById = async (req, res) => {
    try {
        const id = req.params.id
        axios
            .get(ApiUrl + "/" + id, options)
            .then((response) => {
                res.status(200).send(response.data)
            }).catch((err) => { res.status(200).json({ messgae: `Error in fetching Data ${err}` }) })

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
    getAttributeData,
}