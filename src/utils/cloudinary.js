import {v2 as cloudinary} from "cloudinary"
import fs from 'fs'
//import { Upload } from "../middleware/multer";
cloudinary.config({ 
  cloud_name:"dvm0kbwo4", 
  api_key:process.env.CLOUDINARY_API_KEY, 
  api_secret:process.env.CLOUDINARY_API_SECRET
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
        fs.unlinkSync(localFilePath)
        return response;

    } catch (error) {
        fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
        return null;
    }
}



export {uploadOnCloudinary}