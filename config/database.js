const mongoose = require("mongoose");

exports.connect = () => {
  mongoose
    .connect(process.env.MONGO_DB_URL, {dbName:'elred-api-project-db'})
    .then(() => console.log("Connected to Database Successfully!!!!"))
    .catch((error) => console.error(error));
};
