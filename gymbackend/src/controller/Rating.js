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
    const filteredData = sortedProducts.filter((item) => item.rating <= 2);

    const response = await axios.get(ApiUrl, options);
    let array = response.data

    let dataTemp = []
    filteredData.map((it) => {
        dataTemp.push({ target: it.target, category: it.Category })
    })
    let resulta = {};
    let FilterApiData = []  //Contain all filter data from APi

    // dataTemp.forEach((key) => {
    //     console.log("key",key)
    //     resulta[key] = [];
    //     array.forEach((obj) => {
    //         if (obj.Category == key.category && obj.target.Primary?.includes(key.target)) {
    //             FilterApiData.push(obj)
    //         }
    //     });
    // });

    dataTemp.forEach((key) => {
        resulta[key] = [];
        array.forEach((obj) => {
            if (obj.Category == key.category && key.target.Primary) {
                if (typeof key.target.Primary === "string") {
                    if (obj.target.Primary && obj.target.Primary.includes(key.target.Primary)) {
                        FilterApiData.push(obj)
                    }
                } else if (Array.isArray(key.target.Primary)) {
                    for (let i = 0; i < key.target.Primary.length; i++) {
                        if (obj.target.Primary && obj.target.Primary.includes(key.target.Primary[i])) {
                            FilterApiData.push(obj)
                            break;
                        }
                    }
                }
            }
        });
    });

    FilterApiData.forEach(obj2 => {
        const obj1 = filteredData.find(obj1 => obj1.Category === obj2.Category && obj2.id != obj1.id);
        if (obj1) {
            const index = filteredData.indexOf(obj1);
            obj2.rating = obj1.rating;
            obj2.stepsDes = obj1.stepsDes;
            filteredData[index] = obj2;
        }
    });
    const newFilter = sortedProducts.filter((item) => item.rating > 2)

    newFilter.push(filteredData)
    const flatArray = newFilter.flat()
    res.send(flatArray)
}

module.exports = { postRating, addRating, addTestRating }