import mongoose from "mongoose";
import {DB_NAME} from '../constants.js';

const dbConnect = async() => {
    try {
        console.log(process.env.MONGODB_URI,'URL')
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
         console.log('Mongo connected');
        }
        catch(error) {
            console.error('Mongo DB connection error',error)
        }
}

export default dbConnect;