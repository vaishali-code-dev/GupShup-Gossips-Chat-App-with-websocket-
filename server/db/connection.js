import mongoose from "mongoose";

const URL =
    "mongodb+srv://vaishaliJindal00:Ditya%40123@cluster0.gkbxwhd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const connectDB = async () => {
    try {
        await mongoose.connect(URL);
        console.log("DB Connected");
    } catch (err) {
        console.error("Error connecting to database:", err);
        throw new Error(err);
    }
};

export default connectDB;