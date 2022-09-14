const mongoose = require("mongoose");

exports.connect = () => {
  mongoose
    .connect(process.env.MONGO_DB_URL, { dbName: process.env.DATABASE_NAME })
    .then(() => console.log("Connected to Database Successfully!!!!"))
    .catch((error) => console.error(error));
};
