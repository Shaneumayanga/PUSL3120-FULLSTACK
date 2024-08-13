const mongoose = require("mongoose");

module.exports.createDatabaseConnection = () => {
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    maxPoolSize: 10, 
    minPoolSize: 5,
    maxIdleTimeMS: 30000,
  };

  mongoose
    .connect(`mongodb://127.0.0.1:27017/cinema`, options)
    .then(() => {
      console.log("Connected to mongodb.");
    })
    .catch((error) => {
      logger.error("Database Connection Error: ", error);
      console.log("Database Connection Error: ", error);
    });
};
