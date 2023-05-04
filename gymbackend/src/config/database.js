const mongoose = require("mongoose");

const connectDatabase = () => {
    mongoose.connect(
        process.env.MONGOURL,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }).then((res) => {
            console.log('Connected to MongoDB');
            
        }).catch( (error) => {
            console.log(error);
        })
};

module.exports = connectDatabase;