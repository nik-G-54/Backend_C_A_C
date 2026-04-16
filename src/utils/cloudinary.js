import {v2 as cloudinary} from "cloudinary"
import fs from 'fs'
//import { Upload } from "../middleware/multer";
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});






const uploadOnCloudinary = async (localFilePath) => {
    try {
        console.log(localFilePath,"---localfilepath")
        if (!localFilePath ) {
            console.log(localFilePath,"jksdvasdd" )
            return null
            
        }
        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        console.log(response,"---cloudinary response")
        // file has been uploaded successfull
        //console.log("file is uploaded on cloudinary ", response.url);
        if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath)
        return response;

    } catch (error) {
        if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath)
        return null;
    }
}



export {uploadOnCloudinary}