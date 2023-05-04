require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const connectDatabase = require("./src/config/database");
const routes = require('./src/routes')

const corsOptions = {
  origin: '*',
}
app.use(bodyParser.json());

app.use(cors(corsOptions));
app.use('/api', routes);


const port = process.env.PORT || 8000;
app.listen(port, () => {
  connectDatabase();
});



