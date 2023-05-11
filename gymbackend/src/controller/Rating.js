const { default: axios } = require("axios");
const Exersise = require("../model/Excercise");
const Rating = require("../model/Rating");

const { getAllExercise } = require('./index.js');

const ApiUrl = "https://musclewiki.p.rapidapi.com/exercises"
const options = {
    headers: {
        'X-RapidAPI-Key': 'efcf7f0320mshbc0050f3d148c15p1cb8c9jsn6b0c26f1c735',
        'X-RapidAPI-Host': 'musclewiki.p.rapidapi.com'
    }
};



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
const addTestRating = async (req, res) => {
    const data = req.body.Data;

    const exist = await Rating.find()

    const filteredProducts = data
        .map(product => {
            const category = exist.find(category => category.excersizeId === product.id);
            const rating = category ? category.rating : 0;
            return { ...product, rating };
        })
        .filter(product => product.rating !== null);

    const sortedProducts = filteredProducts.sort((a, b) => b.rating - a.rating);

    res.send(sortedProducts)

    // new=========================================

    const filteredData = sortedProducts.filter((item) => item.rating < 2);

    // console.log('filteredData', filteredData)

    const response = await axios.get(ApiUrl, options);

    // Match the filtered data with aa
    const matchedData = response.data.filter((item) => {

        return item.Category == filteredData.map((i) => i.Category)
})
    //     // Check if the item's Category matches with any of the filteredData's categories

    //     const categoryMatch = filteredData.some(
    //       (fdItem) => fdItem.Category === item.Category &&
    //     );

    //     // console.log('categoryMatch', categoryMatch)

    //     // Check if any of the Primary target matches with the filteredData's target
    //     const targetMatch = item?.target?.Primary?.some((pItem) =>
    //       filteredData?.some((fdItem) => fdItem.target === pItem)
    //     );
    //     // console.log('targetMatch', targetMatch)

    //     // If both the conditions are true, return the item
    //     if (categoryMatch && targetMatch) {
    //       return true;
    //     }

    //     return false;
    //   });

    // Print the matched data
    console.log("111111111111111111!!:", matchedData);




    // old==========================
    // const response = await axios.get(ApiUrl, options);
    // let dataTemp = []
    // sortedProducts.map((it) => {
    //     dataTemp.push(it.target)
    // })
    // let array = response.data

    // let resulta = {};

    // dataTemp.forEach((key) => {
    //     resulta[key] = [];
    //     array.forEach((obj) => {
    //         if (obj.target.Primary?.includes(key)) {
    //             resulta[key].push(obj);
    //         }
    //     });
    // });

    // console.log("result-----", resulta);

}

module.exports = { postRating, addRating, addTestRating }