import mongoose from "mongoose";
import app from "./app";
import Config from "./app/config";

const port = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${Config.dbUser}:${Config.dbPass}@cluster0.xbiw867.mongodb.net/${Config.dbName}`
    );
    console.log("Connected to MongoDB");

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    process.exit(1);
  }
};

startServer();
