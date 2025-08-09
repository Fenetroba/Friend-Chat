import mongoose from 'mongoose';


const ConnectDb =async () => {
  try {
    await mongoose.connect(process.env.DB).then(() => {
      console.log("Connected to MongoDB");
    });
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1); // Exit the process with failure
  }
}

export default ConnectDb;
 