const { default: axios } = require("axios");
const Rating = require("../model/Rating");

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
                res.status(200).json(newRating);
            } catch (error) {
                res.status(400).json({ messgae: error })
            }
        }
    } catch (err) {
        console.log("err------", err)
        res.status(400).json({ message: "Bad request" })
    }
}

const addRating = async (req, res) => {

    const allDataEx = [];
    const uniqueExercises = {};
    const updatedArray = [];
    const data = req.body.Data

    // get allexercise from api
    axios.get(ApiUrl, options).then(async (res) => {
        res.data.forEach((item) => {
            allDataEx.push(item)
        })
    }).catch((err) => {
        console.log('err', err)
    })

    // remove duplicate excersizeId and replace rating with latest rating
    data.forEach(item => {
        const { excersizeId, rating } = item;
        if (uniqueExercises[excersizeId]) {
            uniqueExercises[excersizeId].rating = rating;
        } else {
            uniqueExercises[excersizeId] = { excersizeId, rating };
        }
    });

    for (const item in uniqueExercises) {
        updatedArray.push(uniqueExercises[item]);
    }

    // seprate rating <= 2
    const filteredData = updatedArray.filter((item) => item.rating <= 2);

    // had to put setTimeout otherwise data is not coming
    setTimeout(async () => {

        // get perticular record: match id of allexercise to the exerciseId of all exercise
        const myArrayFiltered = allDataEx.filter((el) => {
            return filteredData.some((f) => {
                return f.excersizeId == el.id
            });
        });

        // get data that match category and Primary target value
        myArrayFiltered.forEach(givenItem => {
            const matchedItem = allDataEx.find(apiItem => {
                if (apiItem.Category === givenItem.Category && apiItem.target.Primary.includes(givenItem.target.Primary[0]) && apiItem.id !== givenItem.id) {
                    return true;
                }
                return false;
            });

            // replace old data of rating <= 2 with new record``
            if (matchedItem) {
                const index = myArrayFiltered.indexOf(givenItem);
                myArrayFiltered[index] = matchedItem;
            }
        });

        // from all data seprate rating more then2
        const newFilter = updatedArray.filter((item) => item.rating > 2);
        const myArrayFilteredwww = allDataEx.filter((el) => {
            return newFilter.some((f) => {
                return f.excersizeId == el.id;
            });
        })
        myArrayFilteredwww.push(myArrayFiltered);
        const flatArray = myArrayFilteredwww.flat();

        // get data of rating collection
        const rate = await Rating.find()

        // if id match then add rating field from rating collection
        const filteredProducts = flatArray
            .map(product => {
                const category = rate.find(category => category.excersizeId === product.id);
                const rating = category ? category.rating : 0;
                return { ...product, rating };
            })
            .filter(product => product.rating !== null);
        res.send(filteredProducts)
    }, 5000)
}

module.exports = { postRating, addRating }