const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://muskansoni782003_db_user:xQmvBvZmEz45vuNf@cluster0.ebsdww3.mongodb.net/productivityDB?retryWrites=true&w=majority"
    );
    console.log("MongoDB Connected ✅");
  } catch (error) {
    console.log("MongoDB Error ❌:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;