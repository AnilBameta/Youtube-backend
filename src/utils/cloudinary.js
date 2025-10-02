import { v2 as cloudinary } from "cloudinary";
import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config()

cloudinary.config({
    cloud_name: `${process.env.CLOUDINARY_CLOUD_NAME}`, 
    api_key: `${process.env.CLOUDINARY_API_KEY}`, 
    api_secret: `${process.env.CLOUDINARY_API_SECRET}`
});


const uploadOnCloudinary = async (localFilePath) => {
  try {
     if(!localFilePath) return null;
     //upload file on cloudinary
     const res = await cloudinary.uploader.upload(localFilePath, {
        resource_type: "auto"
     });

     //file has been successfully uploaded
     console.log(res.url);
    await fs.unlinkSync(localFilePath);
     return res;
    }
    catch(err) {
      console.error("Cloudinary upload error:", err.message || err);
      await fs.unlinkSync(localFilePath) //remove locally saved temporary file as upload operation fails
      return null;
    }
}

export {uploadOnCloudinary}
