const Exersise = require("../model/Excercise");
const Rating = require("../model/Rating");

const postRating = async (req, res) => {
    try {
        const { rating, excersizeId } = req.body
        const exist = await Rating.findOne({ excersizeId: excersizeId })
        if (exist) {
            const update = await Rating.findByIdAndUpdate({ _id: exist._id }, { rating: rating }, { new: true })
            res.status(200).json(update);
        } else {
            try {
                const addRating = new Rating(req.body);
                const newRating = await addRating.save();
                res.status(200).json({ message: "new created", data: newRating });
            } catch (error) {
                res.status(400).json({ messgae: error })
            }
        }
    } catch (err) {
        console.log("err === ", err)
        res.status(400).json({ messgae: "Bad request" })
    }
}

const addRating = async (req, res) => {
    try {
        // Initialize empty arrays
        const dataOfRating = [];
        const lengthZero = []
        const moreLength = []

        // Retrieve data from MongoDB and join with ratings collection
        const Arr = await Exersise.aggregate([
            {
                $lookup: {
                    from: 'ratings',
                    localField: "id",
                    foreignField: "excersizeId",
                    as: "ratingList"
                }
            }
        ]);

        // Loop through the data and extract ratings information into aa array
        Arr.map((item) => {
            return (item.ratingList.map((i) => {
                dataOfRating.push({ ratings: i.rating, exi: i.excersizeId })
            }))
        });

        // Sort dataOfRating array in descending order based on ratings
        dataOfRating.sort(function (a, b) {
            return b.ratings - a.ratings
        });

        // Sort Arr array based on the index of each item's corresponding id in dataOfRating array
        Arr.sort((a, b) => {
            const aIndex = dataOfRating.findIndex(obj => obj.exi === a.id);
            const bIndex = dataOfRating.findIndex(obj => obj.exi === b.id);
            return aIndex - bIndex;
        });

        // Sort Arr array based on the length of ratingList array (ascending order)
        Arr.sort(function (a, b) {
            if (a.ratingList < b.ratingList) return -1;
            if (a.ratingList > b.ratingList) return 1;
            return 0;
        });

        // Split Arr array into two arrays based on the length of ratingList array
        Arr.map((ite) => {
            if (ite.ratingList.length == 0) {
                lengthZero.push(ite)
            } else {
                moreLength.push(ite)
            }
        });

        // merge array1 and array2
        const mergeResult = [...moreLength, ...lengthZero];

        // Send JSON response with newaa array
        res.status(200).json({ "data": mergeResult })
    } catch (err) {
        console.log("errrr", err);
        res.status(400).json({ "message": err })
    }

}

module.exports = { postRating, addRating }