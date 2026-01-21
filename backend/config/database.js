const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true, // onnection string ko properly parse kare
      useUnifiedTopology: true, // warnings aur bugs
    });
    
    console.log(`MongoDB Connected Suecessfully!!: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
