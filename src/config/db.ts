import mongoose from "mongoose";

export default async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_DEVELOPMENT_URI || "", {});

    console.log("MongoDB is Connected...");
  } catch (err) {
    process.exit(1);
  }
}
