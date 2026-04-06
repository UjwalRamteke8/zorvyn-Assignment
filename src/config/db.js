import mongoose from "mongoose";

// db string : mongodb+srv://ujwalramteke8739_db_user:kgU29xFWNxjxbwyK@zorvyncluster.lhtgvmv.mongodb.net/
const connectDB = async () => {
  try {
    // process.env.MONGO_URI should be defined in your .env file
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    // Exit the Node.js process with failure code if DB connection fails
    process.exit(1);
  }
};

export default connectDB;