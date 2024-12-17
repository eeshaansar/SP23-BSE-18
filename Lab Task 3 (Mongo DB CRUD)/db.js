const mongoose = require("mongoose");

const connectdb = async () =>{

    const connectionString = "mongodb://localhost:27017/hushi";

    try{
        await mongoose.connect(connectionString);
        console.log("Connected to MongoDb");
    }
    catch(error){
        console.error("MongoDB connection error:", error.message);
        process.exit(1); 
    }
};

module.exports = connectdb;
