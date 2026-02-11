// require ('dotenv').config({path:'./env'})


import mongoose from "mongoose";
import { DB_NAME } from "../../constant.js";





const connectDB=async ()=>{
    try {
        console.log("enter in the db" )
      const connectionDB = await mongoose.connect(`${process.env.MONGO_URI}`)
    //  console.log(`\n mongodb conected ${connectDB.connect.host}`) // connectDB.connection.host it is use to tell that we should connect to which db 
    console.log(`mongodb connected ${connectionDB.connection.host}`)
    } catch (error) {
        console.log("mongoDB connection fail",error)
        process.exit(1)
    }
}

export default connectDB