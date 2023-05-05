const Rating = require("../model/Rating");

const postRating = async (req, res) => {
    try {
        const { rating, excersizeId } = req.body
        const exist = await Rating.findOne({ excersizeId: excersizeId })
        if (exist) {
            const update = await Rating.findByIdAndUpdate({ _id: exist._id }, { rating: rating }, { new: true })
            res.status(200).json(update);
        } else {
            try{
                const addRating = new Rating(req.body);
                const newRating = await addRating.save();
                res.status(200).json({ message: "new created", data: newRating });
            }catch(error){
                res.status(400).json({messgae:error})
            }
        }
    } catch (err) {
        console.log("err === ", err)
        res.status(400).json({ messgae: "Bad request" })
    }
}

module.exports = { postRating }