import mongoose from "mongoose";
require('dotenv').config()

const url = process.env.DB_URL
const db = mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,

})
    .then(db => { console.log("Connection to", db.connection.name, "established"); })
    .catch(error => console.log(error.message))

export default db;