const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://muskansoni782003_db_user:Muskan%401234@cluster0.ebsdww3.mongodb.net/?appName=Cluster0"
    );
    console.log("MongoDB Connected ✅");
  } catch (error) {
    console.log("MongoDB Error ❌:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;