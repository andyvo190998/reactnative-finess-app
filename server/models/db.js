const mongoose = require("mongoose");
const dotEnv = require('dotenv')
dotEnv.config().parsed
/* Replace <password> with your database password */

const db = process.env.MONGO_URI

mongoose.set("strictQuery", true, "useNewUrlParser", true);

const connectDB = async () => {
    try {
        await mongoose.connect(db);
        console.log("MongoDB is Connected...");
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};
module.exports = connectDB;